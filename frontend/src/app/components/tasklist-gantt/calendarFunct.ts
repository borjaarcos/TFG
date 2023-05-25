import * as moment from 'moment';



function getFirstMondayOfMonth(month: number, year: number) {
  // Crear una instancia de Moment.js para el primer día del mes y año especificado
  const firstDayOfMonth = moment(`${year}-${month}-01`, 'YYYY-MM-DD');

  // Calcular el día de la semana del primer día del mes
  const dayOfWeek = firstDayOfMonth.day();

  // 1 = Monday, 6 = Saturday, 7 = Sunday
  if (dayOfWeek === 1) {
    return firstDayOfMonth;
  }
  const daysUntilMonday = 1- dayOfWeek;
  // Si el primer día del mes no es lunes, encontrar el siguiente lunes y retornar su instancia Moment.js
  return firstDayOfMonth.add(daysUntilMonday, 'days');
}


export class weekCalendar{
  weekPlan: Week[] = []
}
class Week {
  week: string | undefined;
  tasks: any[] = []
}
function getFirstDayOfWeek(today: Date){
    // Crear una instancia de Moment.js para el primer día del mes y año especificado
  const firstDayOfMonth = moment(today, 'YYYY-MM-DD');

  // Calcular el día de la semana del primer día del mes
  const dayOfWeek = firstDayOfMonth.day();

  // 1 = Monday, 6 = Saturday, 7 = Sunday
  if (dayOfWeek === 1) {
    return firstDayOfMonth;
  }
  const daysUntilMonday = 1- dayOfWeek;
  // Si el primer día del mes no es lunes, encontrar el siguiente lunes y retornar su instancia Moment.js
  return firstDayOfMonth.add(daysUntilMonday, 'days');
}
export function weeklyCalendar(subtasks: any, today: Date) {

  let dayOfWeek = getFirstDayOfWeek(today);
  let weekCal = new weekCalendar()
  for(var i=0; i<7; i++ ) {
    let week = new Week()
    let dateBegin: Date = new Date(moment(dayOfWeek).format('MM/DD/YYYY'));
    dayOfWeek.add(6, 'days');
    let dateEnd: Date = new Date(moment(dayOfWeek).format('MM/DD/YYYY'));
    const dia = dateBegin.getDate(); // Número entero del día del mes
    const mes = dateBegin.getMonth()+1;
    week['week'] = dia+"/"+mes;
    for(let task in subtasks){
      let date = subtasks[task]['start-date']
      let dueDate = subtasks[task]['due-date']
      let fechaFormateada = date.slice(0, 4) + "/" + date.slice(4, 6) + "/" + date.slice(6, 8);
      let duefechaFormateada = dueDate.slice(0, 4) + "/" + dueDate.slice(4, 6) + "/" + dueDate.slice(6, 8);
      let dateToCheckM:Date =new Date(fechaFormateada);
      let duedateToCheckM:Date =new Date(duefechaFormateada);
      if ((dateBegin.getTime() <= dateToCheckM.getTime() && dateEnd.getTime() >= dateToCheckM.getTime())) {
        week['tasks']?.push(subtasks[task])
      }
      else if((dateBegin.getTime() <= duedateToCheckM.getTime() && dateBegin.getTime() >= dateToCheckM.getTime())) {
          week['tasks']?.push(subtasks[task])
      }
    }
    dayOfWeek.add(1, 'days');

    weekCal['weekPlan']?.push(week)
  }
  return(weekCal)
}

