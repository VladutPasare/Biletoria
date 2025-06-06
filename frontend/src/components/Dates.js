function Dates( {className, onDateChange, givenValue }) {
    const today = new Date().toISOString().split('T')[0];

    const handleChange = (e) => {
        if(onDateChange) {
            onDateChange(e.target.value);
        }
    };

    return (
        <input type="date" className={className} min={today} required onChange={handleChange} defaultValue={givenValue}/>
    );
}

export default Dates;