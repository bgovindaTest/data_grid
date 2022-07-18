<template>
    <div style="height:100%; width: 100%;" ref="dx">
        <flat-pickr style="height:100%; width: 100%;" ref="datePicker" v-model="date" :config="config"></flat-pickr>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import moment from "moment"

let that = null

function OnClose (dates, currentdatestring, picker) {
        //very hacky not sure if it will hold
        setTimeout(() => {  that.params.api.stopEditing(); }, 10);
}

function ParseDate (datestr, format) {
    // console.log(datestr, format)
    let dx = TypeCastDate(datestr, format)
    // return datestr
    return dx
}

//enableTime
//enableSeconds
//range
//allowInvalidPreload

//to create a time picker
//noCalendar
//enableTime

// {
//   altInput: true,
//   dateFormat: "YYYY-MM-DD", for dateTime YYYY-MM-DD HH:MM:SSS
//   altFormat: "YYYY-MM-DD",
//   allowInput: true,
//   parseDate: (datestr, format) => {
//     return moment(datestr, format, true).toDate();
//   },
//   formatDate: (date, format, locale) => {
//     // locale can also be used
//     return moment(date).format(format);
//   }
//  swap between date and datetime format?
// }

//week number

//ISO Date format

/*
Month Year
{
    plugins: [
        new monthSelectPlugin({
          shorthand: true, //defaults to false
          dateFormat: "m.y", //defaults to "F Y"
          altFormat: "F Y", //defaults to "F Y"
          theme: "dark" // defaults to "light"
        })
    ]
};

week_number

*/


function TypeCastDate(date_val, format_string) {
    var date_formats = ['YYYY-MM-DD','YYYY-M-DD','YYYY-MM-D','YYYY-M-D', 'MM/DD/YYYY','M/DD/YYYY','MM/D/YYYY','M/D/YYYY']
    var moment_date = moment(date_val, date_formats, true)
    if (moment_date.isValid()) {
        // return moment_date.format(format_string)
        return moment_date.toDate()
    } else {
        return false
    }
}

//update config from cellEditorParams
export default {
  data() {
    return {
        date: null,
        config: {
            allowInput: true,
            onClose: OnClose
            ,parseDate: ParseDate
        }
    };
  },
   beforeMount() {
   },
    components: { flatPickr },


   mounted() {
       that = this
        this.date = this.params.value;
        this.$nextTick(() => 
        {
            this.$refs.datePicker.fp.open();
        }

        
        
        
        );
   },




   methods: {
        getValue() {
            // this simple editor doubles any value entered into the input
            this.params.eGridCell.focus()
            return this.date;
        },

        isPopup() { return false; },


        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        isCancelBeforeStart() {
            return false;//false;
        },

        // Gets called once when editing is finished (eg if Enter is pressed).
        // If you return true, then the result of the edit will be ignored.
        isCancelAfterEnd() {
            // our editor will reject any value greater than 1000
            return false;
        }
   }
};
</script>

<style lang="scss">
  @import '~flatpickr/dist/flatpickr.css';
</style>