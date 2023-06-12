import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {

  constructor() { }

  async getTasklist(projectid: string | null, cookie: string | null, beginDate: string, endDate: string): Promise<any> {
    const response = await fetch('http://127.0.0.1:5000/tasklist', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectid: projectid,
                cookie: cookie,
                startDate: beginDate,
                endDate: endDate
            }),
        })
    const  payload = await response.json()
    return Promise.resolve(payload)
  }

  async editTask(cookie: string | null, taskid: string, name: string, description: string, mode: number, date: String,
                 dateEnd: String, tag: any): Promise<any> {
    const response = await fetch('http://127.0.0.1:5000/editTask', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                taskid: taskid,
                cookie: cookie,
                name: name,
                description: description,
                date: date,
                mode: mode,
                dateEnd: dateEnd,
                tag: tag
            }),
        })

    const  payload = await response
    console.log(payload)
  }

  async getTags(cookie: string | null) {
    const response = await fetch('http://127.0.0.1:5000/tags', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cookie: cookie
      }),
    })
    const payload = await response.json()
    return Promise.resolve(payload)
  }
}
