#----------------------- STANDARD DASH DEPENDENCIES ---------------------------#

import dash
from dash import dcc, html
import dash_bootstrap_components as dbc
from dash.dependencies import Input, Output
from dash.exceptions import PreventUpdate

#----------------------- THIS APP'S DEPENDENCIES ------------------------------#

from collections import Counter
from datetime import date
import pandas as pd
import plotly.express as px
import random

from dotenv import load_dotenv
import os
from supabase import create_client, Client


# ---------------------- DATABASE SETUP -------------------------------------- #

def supabase_client() -> Client:
    load_dotenv()
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    return create_client(url, key)

supabase = supabase_client()


#----------------------- GLOBALS ----------------------------------------------#

PROJECT_LIST = [
    "ffc69c6c-dbd1-4077-9dc7-1b8be4a7315e",
    "f5a2f3d4-5052-4f21-9017-a1d0ae8cb943",
    "e4b43fa9-b807-45f4-93dd-0c523ade875f",
    "4c6b108c-0c75-49e9-8371-8b5613fe1973",
    "bc695037-a1d1-400e-b495-18097bb0c66b",
    "de43bcbb-612a-4ed7-b493-244a7c6483ff",
    "478a9fad-0453-4f16-aa40-4aea390f8462",
    "f2727f30-1c71-4611-9c4e-917d22b546ba",
    "beb3c122-a747-4328-8435-19d6e770609f",
    "37c6e041-ecf3-45d6-ab26-339c1efcbb25",
    "7a697c14-9953-4b09-8572-452fbe7e0d1c",
    "f16842de-4118-4d92-921f-075c6dedca1e",
    "c6789276-497a-451d-a8b5-17e684251eb6",
    "f7370593-7f26-43ee-bce8-da1badf58f8b"
]

DEFAULT_PROJECT_ID = random.choice(PROJECT_LIST)
DEFAULT_START_DATE = date(2023, 1, 1)
DEFAULT_END_DATE   = date(2023, 5, 26)


#----------------------- DATA FETCHES ------------------------------------------#

def get_project_mapping():

    response = (supabase
                    .table('projects')
                    .select('id, name, github_org, description')
                    .order('name')
                    .execute())
    
    mapping = {
        project['id']: {
            'name': project['name'],
            'github': project['github_org'],
            'description': project['description']
        }
        for project in response.data
        if project['id'] in PROJECT_LIST
    }
    mapping = dict(sorted(mapping.items(), key=lambda x: x[1]['name'].lower()))

    return mapping

PROJECT_MAPPING = get_project_mapping()


def get_events_from_project(project_id, start_date, end_date):

    response = (supabase
                   .table('events')
                   .select('*')
                   .eq('project_id', project_id)
                   .gte('event_time', start_date)
                   .lte('event_time', end_date)
                   .execute())

    return response.data

DEFAULT_EVENTS = get_events_from_project(DEFAULT_PROJECT_ID, DEFAULT_START_DATE, DEFAULT_END_DATE)


def analyze_events(events, min_contribs=1):
    
    project = PROJECT_MAPPING.get(events[0]['project_id'])
    github_org = project.get('github')

    github_events = []
    onchain_events = []
    for e in events:
        source = e['details']['source']
        if source == 'github':
            github_events.append({                                
                'github_org': github_org,
                'repo': e['details']['data']['repository.name'],
                'contributor': e['contributor'],
                'event_type': e['event_type'],
                'amount': e['amount'],
                'timestamp': e['event_time']
            })
        elif source == 'zerion':
            onchain_events.append({
                'event_type': e['event_type'],
                'buy_address': e['details']['data']['Buy Currency Address'],
                'sell_address': e['details']['data']['Sell Currency Address'],
                'amount': e['amount'],
                'timestamp': e['event_time']
            })
        else:
            continue

    if min_contribs > 1:
        contrib_counts = Counter([e['contributor'] for e in github_events])
        github_events = [
            e for e in github_events
            if contrib_counts[e['contributor']] > min_contribs
        ]

    return {
        'project': project,
        'github_events': github_events,
        'onchain_events': onchain_events
    }

DEFAULT_EVENT_ANALYSIS = analyze_events(DEFAULT_EVENTS)


#----------------------- DATAVIZ ----------------------------------------------#


def generate_treemap(events_dict, groupby='repo'):
    
    if groupby == 'repo':
        nodes = ['github_org', 'repo', 'contributor']
    else:
        nodes = ['github_org', 'contributor', 'repo']
    
    df = pd.DataFrame(events_dict['github_events'])[nodes + ['amount']]
    df.dropna(inplace=True)
    
    fig = px.treemap(
        data_frame=df, 
        path=nodes, 
        values='amount', 
        color='contributor',
    )

    fig.update_layout(
        margin=dict(t=20, l=10, r=10, b=10)
    )
    
    return fig


def generate_kpis(events_dict):

    project = events_dict['project']
    github_org = project.get('github')
    project_name = project.get('name')

    git_events = events_dict['github_events']
    contrib_counts = Counter([e['contributor'] for e in git_events])
    repo_counts = Counter(e['repo'] for e in git_events)
    event_counts = Counter(e['event_type'] for e in git_events)
    events_string = ", ".join([f"{k}s - {v}" for k,v in event_counts.items()])

    income = sum([
        e['amount'] for e in events_dict['onchain_events']
        if e['event_type'] == "funds received"
    ])
    
    return [
        dcc.Markdown(
            f"### {project_name} \n"\
            f"A total of {len(contrib_counts)} contributors made " \
            f"{len(git_events)} contributions ({events_string}) in {len(repo_counts)} repos.\n\n" \
            f"The project also received ${income:,.0f} in on-chain funding over this period.",
            style={'margin-bottom': "0px"}
        )
    ]
    

#----------------------- SIDEBAR ----------------------------------------------#

SIDEBAR_STYLE = {
    "position": "fixed",
    "top": 0,
    "left": 0,
    "bottom": 0,
    "width": "16rem",
    "padding": "2rem 1rem",
    "background-color": "#f8f9fa",
}

sidebar = html.Div(
    [
        html.Div(
            html.Img(src="assets/os-observer.png", style={"width": "50px"}),
            style={"textAlign": "center"}
        ),
        html.Br(),
        html.Div(
            [
                html.P("Select an open source project:"),
                dcc.Dropdown(
                    id="project-id",                
                    options=[
                        {"label": pdata['name'], "value": pid}
                        for (pid, pdata) in PROJECT_MAPPING.items()
                    ],
                    value=DEFAULT_PROJECT_ID,
                    style={"margin-left": "1px", "width": "14rem", "font-size": "12px"}
                ),
                html.Br(),
                html.P("Group by:"),
                dcc.Dropdown(
                    id="groupby-select",                
                    options=[
                        {"label": x, "value": x}
                        for x in ['repo', 'contributor']
                    ],
                    value='repo',
                    style={"margin-left": "1px", "width": "14rem", "font-size": "12px"}
                ),
                html.Br(),
                html.P("Select a time period:", style={"display": "inline-block"}),
                dcc.DatePickerRange(
                    id="date-picker",
                    min_date_allowed=date(2018, 1, 1),
                    max_date_allowed=date(2023, 5, 26),
                    start_date=DEFAULT_START_DATE,
                    end_date=DEFAULT_END_DATE,
                    calendar_orientation='horizontal',
                    style={"margin-left": "1px", "width": "14rem", "font-size": "12px"}
                ),
                html.Br(),
                html.Br(),
                html.P("Min. contributions:"),
                dcc.Input(
                    id="min-contribs",
                    type="number",
                    min=0,
                    step=1,
                    value=1,
                    style={"margin-left": "1px", "width": "14rem", "font-size": "12px"}
                )                
            ]
        ),
        html.Br(),
        #html.Hr(),
        html.H6("Project description"),
        html.P(
            PROJECT_MAPPING.get(DEFAULT_PROJECT_ID).get('description'),
            id="project-description", 
            style={"fontSize": "small"}
        ),
    ],
    style=SIDEBAR_STYLE
)

#----------------------- CONTENT ----------------------------------------------#

CONTENT_STYLE = {
    "margin-left": "16rem",
    "margin-right": "0rem",
    "margin-top": "10px",
    "margin-bottom": "10px",
    "padding": "0rem",
}

content = html.Div(
    id="dashboard",
    children=[
        html.P(
            id='kpi-list',
            children=generate_kpis(DEFAULT_EVENT_ANALYSIS),
            style={'height': '15vh', 'margin-left': "10px", 'margin-bottom': "0px"},
        ),
        dcc.Graph(
            id='treemap',
            figure=generate_treemap(DEFAULT_EVENT_ANALYSIS),
            style={'height': '80vh', 'width': '100%'},
        )
    ],
    style=CONTENT_STYLE
)

#----------------------- APP SET-UP---------------------------------------------#

app = dash.Dash(__name__, suppress_callback_exceptions=False,
                external_stylesheets=[dbc.themes.BOOTSTRAP])
server = app.server
app.title = "open source observer"
app.layout = html.Div([content, sidebar])

#----------------------- CALLBACKS --------------------------------------------#

@app.callback(
    [
        Output('treemap', 'figure'),
        Output('project-description', 'children'),
        Output('kpi-list', 'children')
    ],
    [
        Input('project-id', 'value'),
        Input('groupby-select', 'value'),
        Input('date-picker', 'start_date'),
        Input('date-picker', 'end_date'),
        Input('min-contribs', 'value'),
    ]
)
def update_figure(project_id, groupby, start_date, end_date, min_contribs):

    if project_id is None:
        raise PreventUpdate
    
    events = get_events_from_project(project_id, start_date, end_date)
    if not len(events):
        raise PreventUpdate

    events_dict = analyze_events(events, min_contribs)

    fig = generate_treemap(events_dict, groupby)
    descr = PROJECT_MAPPING[project_id]['description']
    kpis = generate_kpis(events_dict)

    return [fig, descr, kpis]

#----------------------- RUN APP ----------------------------------------------#

if __name__ == '__main__':
    app.run_server(debug=True)
