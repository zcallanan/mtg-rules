A NextJS application that displays filterable mtg rule sets.

**Run locally in a Docker Container**
1. Terminal: 
    * docker build . -t mtg-rules
    * docker run -d --rm -p 5000:3000 mtg-rules
2. Browser:
    * http://localhost:5000/ 

**Note on MTG**
MTG is fully owned by Wizards of the Coast and this site just reads the text rule set hosted by WotC.