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
		console.log("on closed fired")
        setTimeout(() => {  that.params.api.stopEditing(); }, 10);
}

function ParseDate (datestr, format) {
    // console.log(datestr, format)
    let dx = TypeCastDate(datestr, format)
    // return datestr
    return dx
}


// {
//   altInput: true,
//   dateFormat: "YYYY-MM-DD",
//   altFormat: "DD-MM-YYYY",
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
            console.log(typeof this.date)
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