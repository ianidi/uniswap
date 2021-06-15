import React, { useState } from "react";
import DatePicker from "@hassanmojab/react-modern-calendar-datepicker";
import { getUnixTime } from "date-fns"
import './datepicker.css'

export const Datepicker = ({ callback, value, placeholder }) => {
    //@ts-ignore
    let defaultValue = {
        year: value.getFullYear(),
        month: value.getMonth() + 1,
        day: value.getDate(),
    };

    const myCustomLocale = {
        // months list by order
        months: [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
        ],

        // week days by order
        weekDays: [
            {
                name: "Понедельник",
                short: "ПН",
            },
            {
                name: "Вторник",
                short: "ВТ",
            },
            {
                name: "Среда",
                short: "СР",
            },
            {
                name: "Четверг",
                short: "ЧТ",
            },
            {
                name: "Пятница",
                short: "ПТ",
            },
            {
                name: "Суббота",
                short: "СБ",
                isWeekend: true,
            },
            {
                name: "Воскресенье", // used for accessibility
                short: "ВС", // displayed at the top of days' rows
                isWeekend: true, // is it a formal weekend or not?
            },
        ],

        // just play around with this number between 0 and 6
        weekStartingIndex: 6,

        // return a { year: number, month: number, day: number } object
        getToday(gregorainTodayObject) {
            return gregorainTodayObject;
        },

        // return a native JavaScript date here
        toNativeDate(date) {
            return new Date(date.year, date.month - 1, date.day);
        },

        // return a number for date's month length
        getMonthLength(date) {
            return new Date(date.year, date.month, 0).getDate();
        },

        // return a transformed digit to your locale
        transformDigit(digit) {
            return digit;
        },

        // texts in the date picker
        nextMonth: "Следующий",
        previousMonth: "Предыдущий",
        openMonthSelector: "Открыть",
        openYearSelector: "Открыть",
        closeMonthSelector: "Закрыть",
        closeYearSelector: "Закрыть",
        defaultPlaceholder: "",

        // for input range value
        from: "От",
        to: "До",

        // used for input value when multi dates are selected
        digitSeparator: ",",

        // if your provide -2 for example, year will be 2 digited
        yearLetterSkip: 0,

        // is your language rtl or ltr?
        isRtl: false,
    };

    const [selectedDay, setSelectedDay] = useState(defaultValue);

    const renderCustomInput = ({ ref }) => (
        <input
            readOnly
            ref={ref}
            placeholder={placeholder}
            //@ts-ignore
            value={selectedDay ? `${selectedDay.year}-${selectedDay.month}-${selectedDay.day}` : ""}
            className="input datepicker__input"
        />
    );

    return (
        <React.Fragment>
            <div className="datepicker__wrapper">
                {placeholder}
                <DatePicker
                    value={selectedDay}
                    onChange={(val) => {
                        //@ts-ignore
                        callback(getUnixTime((new Date(val.year, val.month - 1, val.day, 0, 0, 0))));
                        //@ts-ignore
                        setSelectedDay(val);
                    }}
                    renderInput={renderCustomInput}
                    locale={myCustomLocale}
                    shouldHighlightWeekends
                    // maximumDate={utils().getToday()}
                    calendarPopperPosition="bottom"
                    colorPrimary="#2fa8ec"
                    colorPrimaryLight="#2fa8ec"
                    calendarClassName="datepicker"
                />
            </div>
        </React.Fragment>
    );
};