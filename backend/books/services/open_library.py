import requests

OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json"
OPEN_LIBRARY_WORK_URL = "https://openlibrary.org/works/{work_id}.json"

def normalize_work_id(key):
    """
    Extracts work ID from a full path. E.g., /works/OL12345W -> OL12345W
    """
    if not key:
        return ""
    return key.split('/')[-1]

def search_books(query, limit=15):
    """
    Searches books on Open Library and normalizes the results.
    """
    if not query:
        return []

    try:
        response = requests.get(OPEN_LIBRARY_SEARCH_URL, params={'q': query}, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        docs = data.get('docs', [])[:limit]
        results = []
        
        for doc in docs:
            work_id = normalize_work_id(doc.get('key'))
            if not work_id:
                continue

            authors = doc.get('author_name', [])
            author_str = ", ".join(authors) if authors else "Unknown Author"
            
            cover_i = doc.get('cover_i')
            cover_url = f"https://covers.openlibrary.org/b/id/{cover_i}-M.jpg" if cover_i else None
            
            # Extract first few subjects as "stickers" or genre tags
            subjects = doc.get('subject', [])[:3]
            
            results.append({
                'open_library_id': work_id,
                'title': doc.get('title', 'Untitled'),
                'author': author_str,
                'cover_url': cover_url,
                'publish_year': doc.get('first_publish_year'),
                'genres': subjects,
            })
        return results
    except Exception as e:
        print(f"Open Library Search Error: {e}")
        return []

def get_book_details(work_id):
    """
    Fetches detailed info for a specific work from Open Library and normalizes it.
    """
    if not work_id:
        return None

    try:
        url = OPEN_LIBRARY_WORK_URL.format(work_id=work_id)
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Description can be a string or a dict containing value
        description_data = data.get('description', '')
        if isinstance(description_data, dict):
            description = description_data.get('value', '')
        else:
            description = description_data

        # Authors from works are represented as list of {"author": {"key": "/authors/OL..."}}
        # If we need authors, we may have to fetch them, but usually we pass the author from search,
        # or we check if there are authors list. In detail view, we can also fall back.
        # Let's see if we can get author names:
        authors_list = data.get('authors', [])
        author_names = []
        for author_entry in authors_list:
            # We could fetch authors, but it's slow. We will fallback to caching the author name from the search
            # or local db record.
            pass
            
        covers = data.get('covers', [])
        cover_url = None
        if covers:
            cover_url = f"https://covers.openlibrary.org/b/id/{covers[0]}-L.jpg"

        return {
            'open_library_id': work_id,
            'title': data.get('title', 'Untitled'),
            'description': description,
            'cover_url': cover_url,
        }
    except Exception as e:
        print(f"Open Library Work Detail Error: {e}")
        return None
