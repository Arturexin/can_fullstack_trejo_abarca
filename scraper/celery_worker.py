from scraper_tasks import celery

if __name__ == '__main__':
    celery.start()