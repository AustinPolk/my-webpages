'use strict';

class DatePicker
{
    constructor(id, callback)
    {
        this.div_id = id;
        this.callback = callback;

        this.current_date = null;
        this.current_month = null;
        this.current_year = null;

        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    }

    get_calendar_id()
    {
        return `${this.div_id}-calendar`;
    }

    render_next_month()
    {
        const current = document.getElementById(this.get_calendar_id());
        current.remove();

        const next_month_date = this.current_month === 11
            ? new Date(this.current_year + 1, 0, 1)
            : new Date(this.current_year, this.current_month+1, 1);
        this.render(next_month_date);
    }

    render_last_month()
    {
        const current = document.getElementById(this.get_calendar_id());
        current.remove();

        const last_month_date = this.current_month === 0
            ? new Date(this.current_year - 1, 11, 1)
            : new Date(this.current_year, this.current_month-1, 1);
        this.render(last_month_date);
    }

    render_nav(div)
    {
        const nav_table = document.createElement('table');
        const nav_table_body = document.createElement('tbody');

        // create a "nav bar" for the calendar
        const nav_row = document.createElement('tr');
        nav_row.setAttribute('class', 'nav-row');

        const month_display = document.createElement('td');
        month_display.textContent = `${this.months[this.current_month]}, ${this.current_year}`;
        month_display.setAttribute('class', 'month-display');
        nav_row.appendChild(month_display);
        
        const go_to_last_month = document.createElement('td');
        go_to_last_month.textContent = '<';
        go_to_last_month.setAttribute('class', 'nav-last-month');
        go_to_last_month.addEventListener('click', () => this.render_last_month());
        nav_row.appendChild(go_to_last_month);
        
        const go_to_next_month = document.createElement('td');
        go_to_next_month.textContent = '>';
        go_to_next_month.setAttribute('class', 'nav-next-month');
        go_to_next_month.addEventListener('click', () => this.render_next_month());
        nav_row.appendChild(go_to_next_month);
        
        nav_table_body.appendChild(nav_row);
        nav_table.appendChild(nav_table_body);
        div.appendChild(nav_table);
    }

    handle_click(event)
    {
        const target = event.target;

        const dateObj = {
            year: this.current_year,
            month: this.months[this.current_month],
            day: target.textContent,
        };

        this.callback(this.div_id, dateObj);
    }

    render_calendar(div, 
        days_in_month, 
        first_weekday_of_month, 
        days_in_last_month, 
        week_rows_to_render)
    {
        // render the actual calendar as a table
        const table = document.createElement('table');
        const table_body = document.createElement('tbody');

        // create the weekday header
        const header_row = document.createElement('tr');
        for (let weekday = 0; weekday < 7; weekday++)
        {
            const header_cell = document.createElement('td');
            header_cell.textContent = this.weekdays[weekday][0];
            header_cell.setAttribute('class', 'weekday-header-cell');
            header_row.appendChild(header_cell);
        }
        header_row.setAttribute('class', 'weekday-header');
        table_body.appendChild(header_row);

        let days_created = 0; // keep track of how many calendar days we've made so far

        // number of days we can create until we start creating days for next month
        const next_month_limit = days_in_month + first_weekday_of_month - 1; 

        // create the calendar body week-by-week, day-by-day
        for (let week = 0; week < week_rows_to_render; week++)
        {
            const week_row = document.createElement('tr');
            
            for (let weekday = 0; weekday < 7; weekday++)
            {
                const date_cell = document.createElement('td');

                // handle days before this month
                if (days_created < first_weekday_of_month)
                {
                    const x = first_weekday_of_month - days_created;
                    date_cell.textContent = `${1 + days_in_last_month - x}`;
                    date_cell.setAttribute('class', 'day-last-month');
                }
                // handle days after this month
                else if (days_created > next_month_limit) 
                {
                    date_cell.textContent = `${days_created - next_month_limit}`;
                    date_cell.setAttribute('class', 'day-next-month');
                }
                // handle days during this month
                else
                {
                    date_cell.textContent = `${1 + days_created - first_weekday_of_month}`;
                    date_cell.setAttribute('class', 'day-this-month');
                    date_cell.addEventListener('click', (event) => this.handle_click(event));
                }
                
                days_created += 1;
                week_row.setAttribute('class', 'calendar-week');
                week_row.appendChild(date_cell);
            }
            
            table_body.appendChild(week_row);
        }

        table.appendChild(table_body);
        div.appendChild(table);
    }

    render(date) 
    {
        this.current_date = date;
        this.current_month = date.getMonth();
        this.current_year = date.getFullYear();

        // get some key dates
        const first_date_of_month = new Date(this.current_year, this.current_month, 1); 
        const last_date_of_month = this.current_month === 11
            ? new Date(this.current_year + 1, 0, 0)
            : new Date(this.current_year, this.current_month+1, 0);
        const last_date_of_last_month = this.current_month === 0
            ? new Date(this.current_year - 1, 11, 0)
            : new Date(this.current_year, this.current_month, 0);
            
        // calculate some important values for the number of weeks calculation
        const first_weekday_of_month = first_date_of_month.getDay();
        const last_weekday_of_month = last_date_of_month.getDay();
        const days_in_month = last_date_of_month.getDate();
        const days_in_last_month = last_date_of_last_month.getDate();

        // calculate number of weeks in the calendar
        const days_in_first_week = 7 - first_weekday_of_month;
        let week_rows_to_render = 1;
        let days_left = days_in_month - days_in_first_week;
        while (days_left > 0)
        {
                days_left -= 7;
                week_rows_to_render += 1;
        }

        console.log(`rendering with ${this.current_month} and ${this.current_year}`);
        console.log(`${first_weekday_of_month} ${last_weekday_of_month} ${days_in_month}`);
        console.log(`calendar should have ${week_rows_to_render} weeks`);

        // create a div beneath the given div to make it easier to delete the calendar
        const div = document.getElementById(this.div_id);
        const subdiv = document.createElement('div');
        subdiv.setAttribute('class', 'calendar-div');
        subdiv.setAttribute('id', this.get_calendar_id());
        div.appendChild(subdiv);

        // render the calendar
        this.render_nav(subdiv);
        this.render_calendar(subdiv, 
            days_in_month, 
            first_weekday_of_month, 
            days_in_last_month, 
            week_rows_to_render);
    }
}