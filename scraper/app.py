from flask import Flask, request, jsonify
from database import get_connection
from scraper_tasks import scrape_link

app = Flask(__name__)

@app.route('/')
def home():
    return "Scraper funcionando"

@app.route('/process', methods=['POST'])
def process_links():
    data = request.get_json()
    file_id = data.get('file_id')

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, url FROM links WHERE file_id = %s AND status = 'pending'", (file_id,))
    links = cur.fetchall()

    for link_id, url in links:
        if link_id and url:
            scrape_link.delay(link_id, url)
        else:
            print(f"❌ link_id o url inválido: {link_id}, {url}")

    cur.execute("UPDATE files SET status = 'processing' WHERE id = %s", (file_id,))
    conn.commit() 
    cur.close()
    conn.close()
 
    return jsonify({"message": f"{len(links)} links enviados para scrapeo"})

if __name__ == "__main__":
    app.run(port=9020, debug=True) 