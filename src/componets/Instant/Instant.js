

export function Instant () {

  function time(lan, date, dateStyle, timeStyle) {
     
     const timeValue = Intl.DateTimeFormat(lan,{
        dateStyle:dateStyle,
        timeStyle:timeStyle
    }).format(new Date(date)) 
      
        return timeValue;
    }

/**format change the style of the time (short, medium, long) lan= idioma ('es')  */
    function format(date, title, lan='es', dateStyle='medium', timeStyle){
      
        if(`${new Date(date)}` === 'Invalid Date'){
            return title;
         }
               
         const mediumValue = time(lan, date, dateStyle, timeStyle); 
         return mediumValue;
      
}

 /** add days to date  */   
   function add_days(date, days, title) {
    
      if(`${new Date(date)}` === 'Invalid Date'){
          return title
       }

        const Value= new Date(date);   
            Value.setDate(Value.getDate() + days);
 
      return Value
}

/** diferent betwin two date */   
   function diferent(d1, d2){

      const date= new Date(d1).getTime()
      const date2= new Date(d2).getTime()
      const res=(date2-date)/(1000*60*60*24)
     
        return res;
      
    }

    return {
        format,
        add_days,
        diferent

    }
  }
  
 

