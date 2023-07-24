document.addEventListener('DOMContentLoaded', () => {

    const preloader = document.querySelector('#preloader');

    const calendar = document.querySelector('.calendar'),
        navDate = document.querySelector('.navigation__date'),
        prevBtn = document.querySelector('#prev'),
        nextBtn = document.querySelector('#next'),
        todayBtn = document.querySelector('#today');

    let date = new Date(),
        currYear = date.getFullYear(),
        currMonth = date.getMonth(),
        currDay = date.getDate(),
        step = 0;

    const months = [['Jan', 31], ['Feb', 28], ['Mar', 31], ['Apr', 30], ['May', 31], ['Jun', 30], ['Jul', 31], ['Aug', 31], ['Sep', 30], ['Oct', 31], ['Nov', 30], ['Dec', 31]];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#ffc107', '#198754', '#20c997', '#0dcaf0'];
    const firstHour = 12;

    //===================================== Functions =============================================

    function showNavDate(day, month) {

        let firstNavDay = day - 3,
            lastNavDay = day + 3,
            navMonth = month;

        if (firstNavDay <= 0) {
            navMonth--;
            firstNavDay = months[navMonth][1] - Math.abs(firstNavDay);
            navDate.textContent = `${months[navMonth][0]} ${firstNavDay} - ${months[navMonth + 1][0]} ${lastNavDay}, ${currYear}`;
        } else if (lastNavDay > months[navMonth][1]) {
            navMonth++;
            lastNavDay = lastNavDay - months[navMonth][1];
            navDate.textContent = `${months[navMonth - 1][0]} ${firstNavDay} - ${months[navMonth][0]} ${lastNavDay}, ${currYear}`;
        } else {
            navDate.textContent = `${months[navMonth][0]} ${firstNavDay} - ${lastNavDay}, ${currYear}`;
        }
    }

    //------------------------------------------------

    function showCalendarDate(day, month) {
        let date = '',
            WeekDayIndex = 0;

        day -= 3;

        if (day <= 0) {
            month--;
            day = months[month][1] - Math.abs(day);
            WeekDayIndex = new Date(currYear, month, day).getDay();
            date = `${weekDays[WeekDayIndex]} ${month + 1}/${day}`;
        } else if (day > months[month][1]) {
            month++;
            day = 1;
            WeekDayIndex = new Date(currYear, month, day).getDay();
            date = `${weekDays[WeekDayIndex]} ${month + 1}/${day}`;
        } else {
            WeekDayIndex = new Date(currYear, month, day).getDay();
            date = `${weekDays[WeekDayIndex]} ${month + 1}/${day}`;
        }

        return date;
    }

    //------------------------------------------------

    function drawCurrDay() {

        if (isCurrDayTrue()) {
            for (let i = 1; i < rows.length; i++) {
                rows[i].children[4].classList.add('bg-curr-day');
            }
        } else {
            for (let i = 1; i < rows.length; i++) {
                rows[i].children[4].classList.remove('bg-curr-day');
            }
        }
    }

    //------------------------------------------------

    function drawEventCard(parent, timeArr, event) {

        parent.style.cssText = 'position: relative;';

        const randomIndex = Math.floor(Math.random() * (colors.length - 1));
        const durationCount = event.duration / 30;
        let widthValue = 0,
            opacityCard = 1;

        if (parent.firstElementChild !== null) {
            widthValue = 2;
        } else {
            widthValue = 1;
        }

        eventDayArr = event.date.split('/');

        if (+`20${eventDayArr[2]}` !== currYear || (+eventDayArr[1] - 1) !== currMonth || +eventDayArr[0] !== currDay) {
            if ((Date.parse(new Date(`20${eventDayArr[2]}`, eventDayArr[1] - 1, eventDayArr[0])) - Date.parse(date)) < 0) {
                opacityCard = .4;
            }
        }

        const card = document.createElement('div');
        card.classList.add('card');
        card.style.cssText = `
            background-color: ${colors[randomIndex]};
            height: calc(100% * ${durationCount}); 
            position: absolute; 
            right: 3px;
            width: calc((100% - 5px) / ${widthValue});
            font-size: 12px; 
            color: #fff; 
            border-radius: 3px;
            padding-left: 5px;
            white-space: nowrap;
            overflow: hidden;
            opacity: ${opacityCard};
            `;

        if (durationCount === 1) {
            card.innerHTML = `
                <div class="card-time">${timeArr[0]}:${timeArr[1]} ${event.name}</div>
                `;
        } else {
            card.innerHTML = `
                <div class="card-time">${timeArr[0]}:${timeArr[1]}</div>
                <div class="card-text">${event.name}</div>
                `;
        }
        parent.append(card);
    }

    //------------------------------------------------

    function isCurrDayTrue() {

        const currDayArr = rows[0].children[4].textContent.slice(4).split('/');

        if ((+currDayArr[0] - 1) === date.getMonth() && +currDayArr[1] === date.getDate()) {
            return true;
        } else {
            return false;
        }
    }

    //------------------------------------------------

    function renderHours(hour) {
        let time = '';

        for (let i = 3; i < rows.length; i++) {
            if (i % 2 != 0) {
                if ((hour - 12) === 0) {
                    time = `${hour}am`;
                } else if ((hour - 12) <= 12) {
                    time = `${hour - 12}am`;
                } else {
                    time = `${hour - 24}pm`;
                }
                rows[i].children[0].textContent = time;
                hour++;
            }
        }
    }

    //------------------------------------------------

    function showEvents() {
        let currDayArr, eventDayArr, eventTimeFormat, eventTimeArr, time;

        jsonData.events.forEach(event => {

            for (let i = 0; i < (rows[0].children.length - 1); i++) {
                currDayArr = rows[0].children[i + 1].textContent.slice(4).split('/');
                eventDayArr = event.date.split('/');

                if (+currDayArr[0] === +eventDayArr[1] && +currDayArr[1] === +eventDayArr[0]) {
                    eventTimeArr = event.time.split(':');
                    eventTimeFormat = event.ampm;
                    time = `${eventTimeArr[0]}${eventTimeFormat}`;

                    for (let j = 3; j < rows.length; j++) {
                        if (j % 2 != 0) {
                            if (time === rows[j].children[0].textContent) {
                                if (eventTimeArr[1] === '00') {
                                    drawEventCard(rows[j].children[i + 1], eventTimeArr, event);
                                } else {
                                    drawEventCard(rows[j + 1].children[i + 1], eventTimeArr, event);
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    //------------------------------------------------

    function clearCalendar() {
        for (let i = 1; i < rows[0].children.length; i++) {
            for (let j = 3; j < rows.length; j++) {
                rows[j].children[i].textContent = '';
            }
        }
    }

    //------------------------------------------------

    function renderCalendar(day, month) {

        for (let i = 0; i < (rows[0].children.length - 1); i++) {
            rows[0].children[i + 1].textContent = showCalendarDate(day + i, month);
            rows[0].children[i + 1].classList.add('text-center');
        }
        drawCurrDay();
        renderHours(firstHour);
    }


    //================================ Rendering (main block) ========================================

    for (let i = 0; i <= 50; i++) {
        if (i == 2) {
            calendar.innerHTML += `
        <div class="row">
            <div class="col bg-body-secondary h-3 border-start"></div>
            <div class="col bg-body-secondary h-3"></div>
            <div class="col bg-body-secondary h-3"></div>
            <div class="col bg-body-secondary h-3"></div>
            <div class="col bg-body-secondary h-3"></div>
            <div class="col bg-body-secondary h-3"></div>
            <div class="col bg-body-secondary h-3"></div>
            <div class="col bg-body-secondary h-3 border-end"></div>
        </div>   
        `;
        } else {
            calendar.innerHTML += `
        <div class="row">
            <div class="col border"></div>
            <div class="col border"></div>
            <div class="col border"></div>
            <div class="col border"></div>
            <div class="col border"></div>
            <div class="col border"></div>
            <div class="col border"></div>
            <div class="col border"></div>
        </div>   
        `;
        }
    }

    const rows = document.querySelectorAll('.row');

    for (let i = 0; i < rows[1].children.length; i++) {
        rows[1].children[i].classList.add('h-40');
    }

    rows[1].children[0].textContent = 'all-day';

    for (let i = 0; i < rows.length; i++) {
        rows[i].children[0].classList.add('w-55', 'text-secondary');
    }

    for (let i = 3; i < rows.length; i++)
        for (let j = 0; j < rows[i].children.length; j++) {
            if (i % 2 == 0) {
                rows[i].children[j].classList.add('border-t');
                if (j !== rows[i].children.length - 1) {
                    rows[i].children[j].classList.add('border-r');
                }
            } else {
                rows[i].children[j].classList.add('border-b');
                if (j !== rows[i].children.length - 1) {
                    rows[i].children[j].classList.add('border-r');
                }
            }
        }

    showNavDate(currDay, currMonth);
    renderCalendar(currDay, currMonth);
    setTimeout(function () {
        preloader.classList.add('hidden');
        showEvents();
    }, 500);

    //================================= Liseners ==========================================

    prevBtn.addEventListener('click', () => {
        if (step >= -21) {
            step -= 7;
            currDay -= 7;
            if (currDay <= 0) {
                currMonth--;
                currDay = months[currMonth][1] - Math.abs(currDay);
            }
            showNavDate(currDay, currMonth);
            renderCalendar(currDay, currMonth);
        }
        if (isCurrDayTrue()) todayBtn.disabled = true;
        else todayBtn.disabled = false;
        clearCalendar();
        showEvents();
    });

    nextBtn.addEventListener('click', () => {
        if (step <= 21) {
            step += 7;
            currDay += 7;
            if (currDay > months[currMonth][1]) {
                currDay = currDay - months[currMonth][1];
                currMonth++;
            }
            showNavDate(currDay, currMonth);
            renderCalendar(currDay, currMonth);
        }
        if (isCurrDayTrue()) todayBtn.disabled = true;
        else todayBtn.disabled = false;
        clearCalendar();
        showEvents();
    });

    todayBtn.addEventListener('click', () => {
        currMonth = date.getMonth();
        currDay = date.getDate();
        showNavDate(currDay, currMonth);
        renderCalendar(currDay, currMonth);
        step = 0;
        todayBtn.disabled = true;
        clearCalendar();
        showEvents();
    });
});








