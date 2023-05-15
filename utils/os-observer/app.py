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

from src.database import supabase_client

#----------------------- GLOBALS ----------------------------------------------#

supabase = supabase_client()

DEFAULT_PROJECT_ID = 91
DEFAULT_START_DATE = date(2022, 7, 1)
DEFAULT_END_DATE   = date(2023, 5, 1)

#----------------------- MODULES ----------------------------------------------#


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
    }

    return mapping

PROJECT_MAPPING = get_project_mapping()        


def get_git_events_from_project(project_id, start_date, end_date):

    response = (supabase
                   .table('events')
                   .select('*')
                   .eq('project_id', project_id)
                   .eq('data_source', 'github')
                   .gte('timestamp', start_date)
                   .lte('timestamp', end_date)
                   .execute())

    events_data = response.data

    project = PROJECT_MAPPING.get(project_id)
    github_org = project.get('github')

    return [
        {
            'timestamp': e['timestamp'],
            'event_type': e['event_type'],
            'amount': e['amount'],
            'contributor': e['contributor'],
            'repo': e['details']['repository.name'],
            'github_org': github_org
        }
        for e in events_data
    ]


def get_eth_events_from_project(project_id, start_date, end_date):

    response = (supabase
                   .table('events')
                   .select('*')
                   .eq('project_id', project_id)
                   .eq('data_source', 'zerion')
                   .gte('timestamp', start_date)
                   .lte('timestamp', end_date)
                   .execute())

    return response.data


def generate_treemap(events, groupby='repo'):
    
    if groupby == 'repo':
        nodes = ['github_org', 'repo', 'contributor']
    else:
        nodes = ['github_org', 'contributor', 'repo']
    df = pd.DataFrame(events)[nodes + ['amount']]
    df.dropna(inplace=True)
    
    fig = px.treemap(
        data_frame=df, 
        path=nodes, 
        values='amount', 
        color='contributor',
        color_continuous_scale='RdBu'
    )

    fig.update_layout(
        margin=dict(t=20, l=10, r=10, b=10)
    )
    
    return fig


def generate_kpis(project_id, git_events, eth_events):

    project = PROJECT_MAPPING.get(project_id)
    github_org = project.get('github')
    project_name = project.get('name')

    contrib_counts = Counter([e['contributor'] for e in git_events])
    event_counts = Counter(e['event_type'] for e in git_events)
    repo_counts = Counter(e['repo'] for e in git_events)

    income = 0
    op_income = 0
    for e in eth_events:
        if e['event_type'] == 'income':
            income += e['amount']
            if e['details']['Buy Currency'] == 'OP':
                op_income += e['amount']

    events_string = ", ".join([f"{k}s - {v}" for k,v in event_counts.items()])

    return [
        dcc.Markdown(
            f"### {project_name} \n"\
            f"A total of {len(contrib_counts)} contributors made " \
            f"{len(git_events)} contributions ({events_string}) in {len(repo_counts)} repos.\n\n" \
            f"The project's primary wallet address also received ${income:,.0f} in income over this period.",
            #f"including ${op_income:,.0f} worth of OP grants over this period.",
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
                html.P("Select a time period:",
                        style={"display": "inline-block"}),
                dcc.DatePickerRange(
                    id="date-picker",
                    min_date_allowed=date(2020, 1, 1),
                    max_date_allowed=date(2023, 5, 1),
                    start_date=DEFAULT_START_DATE,
                    end_date=DEFAULT_END_DATE,
                    calendar_orientation='horizontal',
                    style={"margin-left": "1px", "width": "14rem", "font-size": "12px"}
                ),
                
            ]
        ),
        html.Br(),
        html.Hr(),
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
            style={'height': '15vh', 'margin-left': "10px", 'margin-bottom': "0px"},
        ),
        dcc.Graph(
            id='treemap',
            figure=generate_treemap(get_git_events_from_project(
                    DEFAULT_PROJECT_ID, 
                    DEFAULT_START_DATE, 
                    DEFAULT_END_DATE)),
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
        Input('date-picker', 'end_date')
    ]
)
def update_figure(project_id, groupby, start_date, end_date):

    if project_id is None:
        raise PreventUpdate
    
    git_events = get_git_events_from_project(project_id, start_date, end_date)
    if not len(git_events):
        raise PreventUpdate

    eth_events = get_eth_events_from_project(project_id, start_date, end_date)

    fig = generate_treemap(git_events, groupby)
    descr = PROJECT_MAPPING[project_id]['description']
    kpis = generate_kpis(project_id, git_events, eth_events)

    return [fig, descr, kpis]

#----------------------- RUN APP ----------------------------------------------#

if __name__ == '__main__':
    app.run_server(debug=True)
