import React, { Component } from 'react'
import moment from 'moment';
import '../styles/calender.scss';
import Cookies from 'js-cookie';
import axios from 'axios';
export default class Func extends Component {

    year = () => {
        return this.state.dateContext.format("Y");
    }
    month = () => {
        return this.state.dateContext.format("MMMM");
    }
    daysInMonth = () => {
        return this.state.dateContext.daysInMonth();
    }
    currentDate = () => {
        return this.state.dateContext.get("date");
    }
    currentDay = () => {
        return this.state.dateContext.format("D");
    }

    firstDayOfMonth = () => {
        let dateContext = this.state.dateContext;
        let firstDay = moment(dateContext).startOf('month').format('d'); 
        return firstDay;
    }

    setMonth = (month) => {
        let monthNo = this.months.indexOf(month);
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("month", monthNo);
        this.setState({
            dateContext: dateContext
        });
    }

    nextMonth = (props) => {
        let dateContext = Object.assign({}, this.state.dateContext); 
        dateContext = moment(dateContext).add(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onNextMonth && this.props.onNextMonth();
    }

    prevMonth = () => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).subtract(1, "month");
        this.setState({
            dateContext: dateContext
        });
        this.props.onPrevMonth && this.props.onPrevMonth();
    }

    onSelectChange = (e, data) => {
        this.setMonth(data);
        this.props.onMonthChange && this.props.onMonthChange();
    }

    onChangeMonth = (e, month) => {
        this.setState({
            showMonthPopup: !this.state.showMonthPopup
        });
    }

    showYearEditor = () => {
        this.setState({
            showYearNav: true
        });
    }

    setYear = (year) => {
        let dateContext = Object.assign({}, this.state.dateContext);
        dateContext = moment(dateContext).set("year", year);
        this.setState({
            dateContext: dateContext
        })
    }
    onYearChange = (e) => {
        this.setYear(e.target.value);
        this.props.onYearChange && this.props.onYearChange(e, e.target.value);
    }

    onKeyUpYear = (e) => {
        if (e.which === 13 || e.which === 27) {
            this.setYear(e.target.value);
            this.setState({
                showYearNav: false
            })
        }
    }
    handleSubmit = async (e) => {
        const id = Cookies.get('lauth') ? Cookies.get('lauth') : console.log("fmklsdg"); 
        e.preventDefault();
        const event = {
            eventName:this.state.data.eventName,
            eventDate:(this.state.selectedDay) + " " + (this.state.dateContext.format("MMM")) + "," + (this.state.dateContext.format("yy")) ,
            moment:this.state.currentDateContext._d
        };
         const { data:res } = await axios.post(`/api/user/${id}`, event);
        console.log(res);        

    }
    showEventOnThatDate = (events) => {
        const eventThatDay = [];
        const date = this.state.dateContext;
        const thatDay = date.format("MMM,YYYY");
        const length = (events === undefined) ? 0: events.length;
        for (let i=0;i<length;i++) {
            if(thatDay === events[i].eventDate.split(" ")[1]) {
                eventThatDay.push({eventName:events[i].eventName})
                
            }
            console.log(thatDay, events[i].eventDate.split(" ")[1])
        }
        this.setState({eventThatDay})
        console.log(eventThatDay)
    }   
    onDayClick = (e, events, day) => {
        this.setState({
            selectedDay: day
        }, () => {
            console.log(this.state.selectedDay);
            console.log(this.state.dateContext.format("MMM,YYYY"))
        });
        this.props.onDayClick && this.props.onDayClick(e, day);

        this.showEventOnThatDate(e, events, day)
    }
    changeValue(text) {
        this.setState({dropDownValue: text})
    }
    changeMonth(e, data) {
        this.changeValue(e.target.textContent)
        this.onSelectChange(e, data)
    }
    getUserData = async() => {
        const {data:username} = await axios.get("/api/user/register");
        this.setState({
            name:username
        })
    }
    componentDidMount() {
        this.getUserData();
    }
    renderRadio(name, label, id, onChange, value, ...rest) {
        return (<div className="form-check">
                    <input {...rest} className="radio" type="radio" name={name} value={value} onChange={onChange} id={id}/>
                    <label className="radio-labels is-poppins" htmlFor={id}>{label}</label>
                </div>
            );
    };
    handleRadio = ({currentTarget:input}) => {
        const data = {...this.state.data};
        data[input.name] = input.value;
        this.setState({ data });
    };
    
    
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
