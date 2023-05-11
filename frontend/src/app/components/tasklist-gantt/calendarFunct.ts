import * as moment from 'moment';

interface weekCalendar{
  weekPlan: week[]
}
interface week{
  week: string,
  tasks: any[]
}
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

export function weeklyCalendar(month: number, year: number, subtasks: any) {
  let firstMonday = getFirstMondayOfMonth(5,year);
console.log("calendar")
  for(let i = 0; i < 5; i++){
    const dia = firstMonday.date(); // Número entero del día del mes
    const mes = firstMonday.month();
    let aux_firstMonday = firstMonday
    aux_firstMonday.add(6, 'days');
    console.log("Aux-firstmonday", aux_firstMonday);
    console.log(`Hoy es ${dia}/${mes + 1}`);
    for (let subtask in subtasks){

      const date = subtasks[subtask]['due-date']
      let fechaFormateada = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
      const dateToCheck = moment(fechaFormateada);
      console.log(dateToCheck);

      if (dateToCheck.isBetween(firstMonday, aux_firstMonday)) {


        console.log('La fecha SI está dentro de la segunda semana de mayo');
      }

    firstMonday.add(7, 'days');

  }
    console.log("calendarEnds")
}


}
