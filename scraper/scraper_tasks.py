from celery import Celery
import requests
from bs4 import BeautifulSoup
from database import get_connection

celery = Celery(
    'scraper_tasks',
    broker='redis://redis:6379/0',#para docker
    backend='redis://redis:6379/0'#para docker
    # broker='redis://localhost:6379/0',
    # backend='redis://localhost:6379/0'
)
print("scraper_tasks.py cargado")
@celery.task
def scrape_link(link_id, url):
    print(">>> scrape_link ejecutada con:", link_id, url, type(link_id), type(url))
    if not link_id or not url:
        print("❌ link_id o url vacíos")
        return "Error: link_id o url vacíos" 
    
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string.strip() if soup.title else 'Sin título'

        # Tomar solo el primer <p> dentro de <div class="article-content">
        article_div = soup.body.find('div', class_='article-content') if soup.body else None
        if article_div:
            first_p = article_div.find('p')
            if first_p:
                body = first_p.get_text(strip=True)
            else:
                body = article_div.get_text(strip=True) or 'Sin contenido'
        else:
            body = 'Sin contenido'

        conn = get_connection()
        cur = conn.cursor()

        # Guardar contenido
        cur.execute(
            "INSERT INTO scraped_content (link_id, title, body) VALUES (%s, %s, %s)",
            (link_id, title, body)
        )

        # Actualizar estado del link
        cur.execute("UPDATE links SET status = 'done' WHERE id = %s", (link_id,))
        conn.commit()

        cur.close()
        conn.close()

        return f"Scraped link {link_id}"
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("UPDATE links SET status = 'error' WHERE id = %s", (link_id,))
        conn.commit()
        cur.close()
        conn.close()
        return f"Error scraping {link_id}"