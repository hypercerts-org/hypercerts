import json
from selenium import webdriver 
from selenium.webdriver import Chrome 
from selenium.webdriver.chrome.service import Service 
from selenium.webdriver.common.by import By 
import time
from webdriver_manager.chrome import ChromeDriverManager


# initialize a headless web scraper

options = webdriver.ChromeOptions() 
options.headless = True 
options.page_load_strategy = 'none' 

chrome_path = ChromeDriverManager().install() 
chrome_service = Service(chrome_path) 

driver = Chrome(options=options, service=chrome_service) 
driver.implicitly_wait(5)

# local path names

LINKS_PATH = 'links.txt'
DATA_PATH  = 'optimism/data/projects/'


# module for extracting fields from a given project page
def extract_fields(link):

    driver.get(link)
    content = driver.find_element(By.CSS_SELECTOR, "div[class^='_content'")
    project = content.find_element(By.CSS_SELECTOR, "h1[class^='_header'").text
    socials = [s.get_property("href")
               for s in content.find_elements(By.CSS_SELECTOR, "a[class^='_socialLink'")]
    responses = content.find_elements(By.TAG_NAME, "section")
    description = responses[0].find_element(By.TAG_NAME, "p").text
    category = responses[1].find_element(By.CSS_SELECTOR, "span[class^='_label'").text
    try:
        address = content.find_element(By.CSS_SELECTOR, "div[class^='_addressWrapper'").text
    except:
        print("No address:", link)
        address = None
    p_grabber = lambda r: "\n".join([t.text for t in r.find_elements(By.TAG_NAME, "p")])
    logo = driver.find_element(By.CSS_SELECTOR, "img[class^='_image'").get_property("src")
    try:
        banner = (driver
                  .find_element(By.CSS_SELECTOR, "div[class^='_banner'")
                  .find_element(By.TAG_NAME, "img").get_property("src"))
    except:
        print("No banner:", link)
        banner = None
    
    return {
        'project': project,
        'socials': socials,
        'description': description,
        'category': category,
        'public_goods': p_grabber(responses[2]),
        'sustainability': p_grabber(responses[3]),
        'team_size': p_grabber(responses[4]),
        'address': address,
        'banner': banner,
        'logo': logo        
    }


# process each link and store the data
def process_url(link):

    result = extract_fields(link)    
    result.update({'project_link': link})
    result.update({'address': link.split("/")[-1]})
    
    j = json.dumps(result, indent=4)
    outpath = f"{DATA_PATH}{result['address']}.json"
    with open(outpath, "w") as outfile:
        outfile.write(j)

    return result


# read and process all links
def scrape_all_projects():

    with open(LINKS_PATH, 'r') as txt_file:
        links = [f.strip() for f in txt_file.readlines()]

    for project_url in links:
        #time.sleep(2)
        try:
            result = process_url(project_url)         
            print("✅ Scraped: ", result['project'])
        except:
            print("❌ Error:", project_url)  


if __name__ == "__main__":
    scrape_all_projects()   
    driver.quit()