from dotenv import load_dotenv
import logging
import openai
import os
import requests
import time


def summarize(text_blob, max_tokens=1250, tries=0):

    if not isinstance(text_blob, str):
        return ""

    tokens = text_blob.split(" ")
    if len(tokens) < 100:
        return text_blob

    load_dotenv()
    openai.api_key = os.environ['OPENAI_API_KEY']

    text_blob = " ".join(tokens[:(max_tokens-500)])

    prompt = (f"Consider the following text:\n\n"
              f"---\n\n"
              f"{text_blob}\n\n"
              f"---\n\n"
              f"Please convert this into a 2-3 sentence summary that describes what the project is doing." 
              f"Use the name of the project in the description, eg: 'Project X is an open source protocol for...'."
              f"Only return the summary text; don't return any other comments or superfluous text.")

    try:

        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.5,
            max_tokens=(max_tokens*2),
            n=1,
            stop=None
        )
        
        new_text = response.choices[0].text
        new_text = new_text.strip()
        new_text = new_text.strip('"')

        return new_text    
    
    except Exception as e:

        tries += 1
        if tries == 3:
            print(f"Aborting process after {tries} tries.")
            return "aborted"

        print(e)        
        time.sleep(30)

        return summarize(text_blob, max_tokens)