
import json
import re

def parse_html_table_to_json(html_content):
    # Extract table headers
    thead_match = re.search(r'<thead>(.*?)</thead>', html_content, re.DOTALL)
    if not thead_match:
        return None
    
    headers_html = thead_match.group(1)
    headers = [th.strip() for th in re.findall(r'<th>(.*?)</th>', headers_html)]
    languages = headers[1:]
    
    # Prepare data structure
    data = {"languages": languages, "features": []}
    
    # Extract table body
    tbody_match = re.search(r'<tbody>(.*?)</tbody>', html_content, re.DOTALL)
    if not tbody_match:
        return None
        
    tbody_html = tbody_match.group(1)
    
    # Process rows
    rows = re.findall(r'<tr(.*?)>(.*?)</tr>', tbody_html, re.DOTALL)
    
    current_section = None
    for row_attrs, row_content in rows:
        if 'class="section-header"' in row_attrs:
            section_name_match = re.search(r'<td[^>]*>(.*?)</td>', row_content, re.DOTALL)
            if section_name_match:
                current_section = {
                    "section": section_name_match.group(1).strip(),
                    "items": []
                }
                data["features"].append(current_section)
        else:
            if current_section is None:
                current_section = {
                    "section": "Unknown",
                    "items": []
                }
                data["features"].append(current_section)

            cells = re.findall(r'<td[^>]*>(.*?)</td>', row_content, re.DOTALL)
            if len(cells) == len(headers):
                feature_name = cells[0].strip()
                feature_details = {
                    "feature": feature_name
                }
                
                for i, language in enumerate(languages):
                    feature_details[language] = cells[i+1].strip()
                
                current_section["items"].append(feature_details)

    return data

# Read the HTML file
with open('/Users/Adrain/Documents/code/study/program-language/program-language.html', 'r') as f:
    html_content = f.read()

# Parse the HTML and convert to JSON
json_data = parse_html_table_to_json(html_content)

# Write the JSON data to a file
if json_data:
    with open('/Users/Adrain/Documents/code/study/program-language/program-language-nextjs/src/data.json', 'w') as f:
        json.dump(json_data, f, indent=4)
