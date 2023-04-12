from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
import requests
from requests.cookies import RequestsCookieJar
app = Flask(__name__)

app.config['SECRET_KEY'] = 'mysecretkey'
app.config['SESSION_TYPE'] = 'filesystem'  # Se puede utilizar otro tipo de almacenamiento
app.config['SESSION_FILE_DIR'] = './session'
app.config['SESSION_FILE_THRESHOLD'] = 500
app.config['SESSION_FILE_MODE'] = 384

CORS(app)
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=True)

redis_host = 'localhost'
redis_port = 6379
redis_password = None
redis_db = 0


@app.route('/<string:cookie>', methods=['GET'])
def get_projects2(cookie):
    session = requests.Session()
    my_cookie_jar = requests.cookies.RequestsCookieJar()
    my_cookie_jar.set('tw-auth', cookie)
    session.cookies.update(my_cookie_jar)

    url = "https://beedata.teamwork.com/projects.json"
    response = session.get(url)

    name = response.json()['projects'][0]
    data = {}
    data2 = []
    data['id'] = name['id']
    data['name'] = name['name']
    data2.append(data)
    # Verificar si la solicitud fue exitosa
    if response.status_code == 200:
        print("La solicitud fue exitosa.")
        my_response = make_response(jsonify(data2))
        my_response.headers['Access-Control-Allow-Origin'] = '*'
        my_response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    else:
        print("La solicitud falló.")

    return my_response
@app.route('/login', methods=['POST'])
def get_twCookie():
    url = "https://beedata.teamwork.com/authenticate.json"
    username = "info@beedataanalytics.com"
    password = "beedata23TFG"
    #req = request.get_json()
    response = requests.get(url, auth=(username, password))
    if response.status_code == 200:
        print("La solicitud fue exitosa.")
    else:
        print("La solicitud falló. Código de estado:", response.status_code)

    cookiejar = response.cookies
    cookies_dict = cookiejar.get_dict()
    mi_respuesta = make_response(jsonify(cookies_dict))
    mi_respuesta.headers['Access-Control-Allow-Origin'] = '*'
    mi_respuesta.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    mi_respuesta.set_cookie('cookie', value=cookies_dict['tw-auth'])
    return mi_respuesta

@app.route('/tasklist', methods=['POST'])
def get_tasklist():
    req = request.get_json()
    url = "https://beedata.teamwork.com/projects/"+req['projectid']+"/tasklists.json"
    session = requests.Session()
    my_cookie_jar = requests.cookies.RequestsCookieJar()
    my_cookie_jar.set('tw-auth', req['cookie'])
    session.cookies.update(my_cookie_jar)

    responseTasklists = session.get(url)
    if responseTasklists.status_code == 200:
        data = []
        for tasklist in responseTasklists.json()['tasklists']:
            id = tasklist['id']
            i = 0
            url = "https://beedata.teamwork.com/tasklists/" + id + "/tasks.json"
            responseTasks = session.get(url)
            todo = []
            for task in responseTasks.json()['todo-items']:
                todo.append(task)
            tasklist['tasks'] = todo
            data.append(tasklist)
            i = i+1

        my_response = make_response(jsonify(data))
        my_response.headers['Access-Control-Allow-Origin'] = '*'
        my_response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return my_response
    else:
        print("La solicitud falló.")
if __name__ == '__main__':

    app.run(port=5000)

