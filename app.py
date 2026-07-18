from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from functools import wraps
import json
import os
import uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'hotel77-secret-key-2026'
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# ==================== DATA LAYER ====================
DATA_FILE = 'data.json'

def get_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return get_default_data()

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def get_default_data():
    return {
        "settings": {
            "hotel_name": "Hotel 77",
            "tagline": "Comfort, Hospitality & Convenience in Shreegaun, Jakhera, Lamahi",
            "logo_url": "/static/uploads/logo.png",
            "hero_image_url": "/static/uploads/exterior-1.png",
            "primary_phone": "9847871687",
            "secondary_phone": "9857841687",
            "whatsapp_number": "9847871687",
            "whatsapp_prefilled_text": "Hello, I am interested in booking a stay at Hotel 77.",
            "email_address": "hotel77@gmail.com",
            "address": "Shreegaun, Jakhera, Lamahi, Dang, Nepal",
            "google_maps_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3527.2722631552697!2d82.5657133753295!3d27.862905676093725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3997a36fb3930c71%3A0x49ac19d8da197d81!2sHotel%2077!5e0!3m2!1sen!2snp!4v1781294849874!5m2!1sen!2snp",
            "seo_title": "Hotel 77 | Lamahi Premier Hotel",
            "seo_description": "Enjoy comfortable stays at Hotel 77 in Lamahi, Dang, Nepal.",
            "footer_content": "© 2026 Hotel 77. Shreegaun, Jakhera, Lamahi, Dang, Nepal.",
            "maintenance_mode": False
        },
        "rooms": [
            {"id": "room-110", "name": "Suite - Room 110", "short_description": "Spacious family suite for comfort and relaxation.", "full_description": "Room 110 offers generous space for families with one double and one single bed.", "capacity_guests": 3, "capacity_beds": 2, "amenities": ["Air Conditioning", "Free Wi-Fi", "Double Bed", "Single Bed", "Room Service", "Attached Bathroom", "Hot & Cold Shower"], "images": ["/static/uploads/110.png"], "featured": True, "enabled": True, "category": "Suite"},
            {"id": "room-107", "name": "Suite - Room 107", "short_description": "Spacious suite with cozy seating area.", "full_description": "Room 107 features a double and single bed with seating area, dining table, and chairs.", "capacity_guests": 3, "capacity_beds": 2, "amenities": ["Air Conditioning", "Free Wi-Fi", "Double Bed", "Single Bed", "Seating Area", "Room Service"], "images": ["/static/uploads/107.png"], "featured": True, "enabled": True, "category": "Suite"},
            {"id": "room-105", "name": "Deluxe Room - Room 105", "short_description": "Comfortable deluxe room with king-size bed.", "full_description": "Room 105 features a king-size bed, seating area with table and chairs.", "capacity_guests": 2, "capacity_beds": 1, "amenities": ["Air Conditioning", "Free Wi-Fi", "King Bed", "Seating Area", "Room Service"], "images": ["/static/uploads/105.png"], "featured": True, "enabled": True, "category": "Deluxe Room"},
            {"id": "room-101", "name": "Deluxe Room - Room 101", "short_description": "Modern deluxe room offering comfort.", "full_description": "Room 101 has a king-size bed, AC, Wi-Fi, and quality furnishings.", "capacity_guests": 2, "capacity_beds": 1, "amenities": ["Air Conditioning", "Free Wi-Fi", "King Bed", "Room Service"], "images": ["/static/uploads/101.png"], "featured": False, "enabled": True, "category": "Deluxe Room"},
            {"id": "room-104", "name": "Standard Room - Room 104", "short_description": "Affordable comfort for a pleasant stay.", "full_description": "Room 104 features a king-size bed, ceiling fan, Wi-Fi, and clean bathroom.", "capacity_guests": 2, "capacity_beds": 1, "amenities": ["Free Wi-Fi", "King Bed", "Ceiling Fan", "Room Service"], "images": ["/static/uploads/104.png"], "featured": False, "enabled": True, "category": "Standard Room"},
            {"id": "room-103", "name": "Standard Room - Room 103", "short_description": "Simple, clean, and comfortable.", "full_description": "Room 103 offers a king-size bed, Wi-Fi, and ceiling fan.", "capacity_guests": 2, "capacity_beds": 1, "amenities": ["Free Wi-Fi", "King Bed", "Ceiling Fan", "Room Service"], "images": ["/static/uploads/103.png"], "featured": False, "enabled": True, "category": "Standard Room"},
            {"id": "room-102", "name": "Standard Room - Room 102", "short_description": "Budget-friendly comfort.", "full_description": "Room 102 provides a king-size bed, Wi-Fi, ceiling fan, and clean bathroom.", "capacity_guests": 2, "capacity_beds": 1, "amenities": ["Free Wi-Fi", "King Bed", "Ceiling Fan", "Room Service"], "images": ["/static/uploads/102.png"], "featured": False, "enabled": True, "category": "Standard Room"}
        ],
        "gallery": [
            {"id": "g-ext-1", "url": "/static/uploads/exterior-1.png", "category": "Exterior", "caption": "Hotel 77 Front View"},
            {"id": "g-ext-2", "url": "/static/uploads/exterior-2.png", "category": "Exterior", "caption": "Hotel 77 Entrance & Surroundings"},
            {"id": "g-int-1", "url": "/static/uploads/interior-1.png", "category": "Interior", "caption": "Reception & Lounge Area"},
            {"id": "g-int-2", "url": "/static/uploads/interior-2.png", "category": "Interior", "caption": "Interior Hallway"},
            {"id": "g-int-3", "url": "/static/uploads/interior-3.png", "category": "Interior", "caption": "Common Area"},
            {"id": "g-int-4", "url": "/static/uploads/interior-4.png", "category": "Interior", "caption": "Hotel Interior Design"},
            {"id": "g-room-110", "url": "/static/uploads/110.png", "category": "Rooms", "caption": "Suite 110 - Family Suite"},
            {"id": "g-room-107", "url": "/static/uploads/107.png", "category": "Rooms", "caption": "Suite 107"},
            {"id": "g-room-105", "url": "/static/uploads/105.png", "category": "Rooms", "caption": "Deluxe Room 105"},
            {"id": "g-room-101", "url": "/static/uploads/101.png", "category": "Rooms", "caption": "Deluxe Room 101"},
            {"id": "g-room-102", "url": "/static/uploads/102.png", "category": "Rooms", "caption": "Standard Room 102"},
            {"id": "g-room-103", "url": "/static/uploads/103.png", "category": "Rooms", "caption": "Standard Room 103"},
            {"id": "g-room-104", "url": "/static/uploads/104.png", "category": "Rooms", "caption": "Standard Room 104"}
        ],
        "testimonials": [
            {"id": "t1", "author_name": "Sita Sharma", "rating": 5, "content": "Hotel 77 is the best place to stay in Lamahi. Clean rooms, friendly staff, and great food.", "source": "Google Review", "featured": True},
            {"id": "t2", "author_name": "Rajesh Hamal", "rating": 5, "content": "Excellent service and very comfortable rooms. Perfect location for travelers.", "source": "Direct Guest", "featured": True},
            {"id": "t3", "author_name": "Anita Gurung", "rating": 4, "content": "Very clean and well-maintained. Great value for money.", "source": "Booking.com", "featured": True}
        ],
        "messages": [],
        "menu": [
            {"id": "mn1", "label": "Home", "path": "/", "order": 1},
            {"id": "mn2", "label": "Rooms & Suites", "path": "/rooms", "order": 2},
            {"id": "mn3", "label": "Gallery", "path": "/gallery", "order": 3},
            {"id": "mn4", "label": "About", "path": "/page/about", "order": 4},
            {"id": "mn5", "label": "Contact", "path": "/contact", "order": 5}
        ],
        "pages": [
            {"id": "about", "slug": "about", "title": "The Story of Hotel 77", "content": "### Comfort & Hospitality in Shreegaun, Jakhera, Lamahi\n\nLocated in the peaceful surroundings of Shreegaun, Jakhera, Lamahi, Dang, Nepal, **Hotel 77** offers a comfortable and welcoming stay for travelers, families, and business guests.\n\n### Our Philosophy\nWe believe great hospitality begins with genuine care. We provide clean, comfortable accommodations and friendly service.\n\n### Why Choose Hotel 77?\n* Comfortable Standard, Deluxe, and Family Suite rooms\n* Free High-Speed Wi-Fi\n* Daily housekeeping\n* Peaceful environment\n* Ample parking\n* Excellent value for money", "last_updated": "2026-07-18"}
        ],
        "admin_password": generate_password_hash("admin77")
    }

# ==================== AUTH ====================
def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not session.get('logged_in'):
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated

# ==================== STATIC FILES SETUP ====================
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ==================== PUBLIC ROUTES ====================
@app.route('/')
def home():
    data = get_data()
    return render_template('index.html', data=data)

@app.route('/rooms')
def rooms_page():
    data = get_data()
    return render_template('rooms.html', data=data)

@app.route('/gallery')
def gallery_page():
    data = get_data()
    return render_template('gallery.html', data=data)

@app.route('/contact')
def contact_page():
    data = get_data()
    return render_template('contact.html', data=data)

@app.route('/page/<slug>')
def page_view(slug):
    data = get_data()
    page = next((p for p in data['pages'] if p['slug'] == slug), None)
    if not page:
        return render_template('404.html', data=data), 404
    return render_template('page.html', data=data, page=page)

# API - public data
@app.route('/api/public/data')
def api_public_data():
    data = get_data()
    return jsonify({
        'settings': data['settings'],
        'rooms': [r for r in data['rooms'] if r['enabled']],
        'gallery': data['gallery'],
        'testimonials': data['testimonials'],
        'pages': data['pages'],
        'menu': sorted(data['menu'], key=lambda x: x['order'])
    })

@app.route('/api/public/contact', methods=['POST'])
def api_contact():
    body = request.json
    if not body or not body.get('name') or not body.get('email') or not body.get('message'):
        return jsonify({'error': 'Name, email, and message are required.'}), 400
    data = get_data()
    msg = {
        'id': 'msg-' + str(uuid.uuid4()),
        'name': body['name'],
        'email': body['email'],
        'phone': body.get('phone', ''),
        'message': body['message'],
        'created_at': datetime.now().isoformat(),
        'read': False,
        'notes': ''
    }
    data['messages'].insert(0, msg)
    save_data(data)
    return jsonify({'success': True, 'message': 'Thank you! Your message has been received.'})

# ==================== ADMIN ROUTES ====================
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if request.method == 'POST':
        password = request.form.get('password', '')
        data = get_data()
        if check_password_hash(data['admin_password'], password):
            session['logged_in'] = True
            return redirect(url_for('admin_dashboard'))
        return render_template('admin_login.html', error='Invalid password')
    return render_template('admin_login.html')

@app.route('/admin/logout')
def admin_logout():
    session.pop('logged_in', None)
    return redirect(url_for('admin_login'))

@app.route('/admin')
@login_required
def admin_dashboard():
    data = get_data()
    return render_template('admin.html', data=data)

@app.route('/admin/update-settings', methods=['POST'])
@login_required
def admin_update_settings():
    data = get_data()
    for key in request.form:
        if key in data['settings']:
            data['settings'][key] = request.form[key]
    if request.form.get('maintenance_mode'):
        data['settings']['maintenance_mode'] = True
    else:
        data['settings']['maintenance_mode'] = False
    save_data(data)
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/upload', methods=['POST'])
@login_required
def admin_upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({'error': 'Invalid file type'}), 400
    filename = 'upload-' + str(uuid.uuid4()) + '.' + ext
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    return jsonify({'success': True, 'url': '/static/uploads/' + filename})

@app.route('/admin/rooms/add', methods=['POST'])
@login_required
def admin_add_room():
    data = get_data()
    room = {
        'id': 'room-' + str(uuid.uuid4())[:8],
        'name': request.form['name'],
        'short_description': request.form.get('short_description', ''),
        'full_description': request.form.get('full_description', ''),
        'capacity_guests': int(request.form.get('capacity_guests', 2)),
        'capacity_beds': int(request.form.get('capacity_beds', 1)),
        'amenities': [a.strip() for a in request.form.get('amenities', '').split(',') if a.strip()],
        'images': [request.form.get('image_url', '/static/uploads/logo.png')],
        'featured': 'featured' in request.form,
        'enabled': True,
        'category': request.form.get('category', 'Standard Room')
    }
    data['rooms'].append(room)
    save_data(data)
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/rooms/delete/<room_id>', methods=['POST'])
@login_required
def admin_delete_room(room_id):
    data = get_data()
    data['rooms'] = [r for r in data['rooms'] if r['id'] != room_id]
    save_data(data)
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/messages')
@login_required
def admin_messages():
    data = get_data()
    return render_template('admin_messages.html', data=data)

@app.route('/admin/messages/delete/<msg_id>', methods=['POST'])
@login_required
def admin_delete_message(msg_id):
    data = get_data()
    data['messages'] = [m for m in data['messages'] if m['id'] != msg_id]
    save_data(data)
    return redirect(url_for('admin_messages'))

@app.route('/admin/reset', methods=['POST'])
@login_required
def admin_reset():
    save_data(get_default_data())
    return redirect(url_for('admin_dashboard'))

# ==================== ERROR HANDLER ====================
@app.errorhandler(404)
def not_found(e):
    data = get_data()
    return render_template('404.html', data=data), 404

# ==================== RUN ====================
if __name__ == '__main__':
    app.run(debug=True)
