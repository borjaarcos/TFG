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
def successful_login(cookie):
    session = requests.Session()
    my_cookie_jar = requests.cookies.RequestsCookieJar()
    my_cookie_jar.set('tw-auth', cookie)
    session.cookies.update(my_cookie_jar)

    url = "https://beedata.teamwork.com/projects.json"
    response = session.get(url)

    res = []
    for project in response.json()['projects']:
        data = {}
        data['id'] = project['id']
        data['name'] = project['name']
        res.append(data)
    # Verificar si la solicitud fue exitosa
    if response.status_code == 200:
        print("La solicitud fue exitosa.")
        my_response = make_response(jsonify(res))
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
    #Creating a cookiejar useful when doing a response
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
        subtasks = []
        for tasklist in responseTasklists.json()['tasklists']:
            id = tasklist['id']
            i = 0
            url = "https://beedata.teamwork.com/tasklists/" + id + "/tasks.json"
            responseTasks = session.get(url)
            todo = []
            for task in responseTasks.json()['todo-items']:
                if 'parent-task' not in task:
                    todo.append(task)
                elif 'content' in task:
                    subtasks.append(task)
            tasklist['tasks'] = todo
            data.append(tasklist)
            i = i+1
        res = {}
        res['tasklists'] = data
        res['subtasks'] = subtasks
        my_response = make_response(jsonify(res))
        my_response.headers['Access-Control-Allow-Origin'] = '*'
        my_response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return my_response
    else:
        print("La solicitud falló.")
def dataMaker(mode, name, date, id):
    if(mode == 1 or mode == 4):
    #Cuidado con el nombre de los atributos, sino no va
        data = {
            "todo-list": {
                "name": name
            }
        }
    elif(mode == 2):
        data = {
            "todo-item": {
                "content": name
            }
        }
    elif(mode == 3):
        data = {
            "todo-item": {
                "content": name,
                "start-date": date
            }
        }
    elif (mode == 5):
        data = {
            "project": {
                "name": name,
            }
        }
    elif (mode == 6):
        data = {
            "task": {
                "content": name,
                "due-date": date
            }
        }
    elif (mode == 7):
        data = {
            "todo-item": {
                "content": name,
                "due-date": date
            }
        }
    return data


def urlMaker(taskid, mode):
    if (mode == 1):
        # Edit tasklist
        url = 'https://beedata.teamwork.com/tasklists/' + taskid + '.json'
    elif (mode <= 3):
        # Edit tasks
        url = 'https://beedata.teamwork.com/tasks/' + taskid + '.json'
    elif (mode == 4):
        # Add tasklist to project
        url = 'https://beedata.teamwork.com/projects/' + taskid + '/tasklists.json'
    elif (mode == 5):
        # Edit project name
        url = 'https://beedata.teamwork.com/projects/' + taskid + '.json'
    elif (mode == 6):
        # Add task to tasklist
        url = 'https://beedata.teamwork.com/tasklists/' + taskid + '/tasks.json'
    elif (mode == 7):
        # Add subtask to task
        url = 'https://beedata.teamwork.com/tasks/' + taskid + '.json'
    return url

#Mode 1: edit tasklist name
#Mode 2: edit tasks name
#Mode 3: edit subtasks name and date
#Mode 4: create tasklist in project
#Mode 5: edit project name
#Mode 6: create task in tasklist
#Mode 7: create subtask in task
@app.route('/editTask', methods=['POST'])
def editTasklist():
    req = request.get_json()
    session = requests.Session()
    headers = {
        "Content-Type": "application/json"
    }
    cookies = {'tw-auth': req['cookie']}

    data = dataMaker(req['mode'], req['name'], req['date'], str(req['taskid']))

    url = urlMaker(str(req['taskid']), req['mode'])

    # Realizar la petición PUT a la API de Teamwork con los datos y headers definidos previamente
    if(req['mode'] == 4 or req['mode'] > 5):
        response = session.post(url, headers=headers, cookies=cookies, json=data)
    else:
        response = session.put(url, headers=headers, cookies=cookies, json=data)
    # Comprobar que la petición ha sido exitosa (código 200)
    if response.status_code == 200:
        print('Tasklist editada correctamente.')
        return "200"
    else:
        print('Error al editar tasklist:', response.content)
        return "error"



if __name__ == '__main__':

    app.run(port=5000)

