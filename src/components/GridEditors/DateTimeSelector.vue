<template>
    <div style="height:100%; width: 100%;" ref="dx">
        <flat-pickr style="height:100%; width: 100%;" ref="datePicker" v-model="date" :config="config"></flat-pickr>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';

let that = null

function OnClose (dates, currentdatestring, picker) {
        //very hacky not sure if it will hold
        setTimeout(() => {  that.params.api.stopEditing(); }, 10);
}


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

//update config from cellEditorParams
export default {
    data() {
        return {
            date: null,
            config: {
                allowInput: true,
                onClose: OnClose
                //,parseDate: ParseDate
            }
        };
    },
    beforeMount() {
        let x = this.flatPickerConfig()
        this.config = x
    },
    components: { flatPickr },


    mounted() {
        that = this
        this.date = this.params.value;
        this.$nextTick(() => 
        { this.$refs.datePicker.fp.open(); });
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
        },
        flatPickerConfig() {
            let colDef   = this.params.colDef
            let dataType = colDef['dataType']
            if (dataType === 'time' ) {
                return  {
                    enableTime: true,
                    enableSeconds: true,
                    allowInput: true,
                    noCalendar: true,
                    onClose: OnClose                    
                }
            } else if (dataType === 'date' ) {
                return {
                    allowInput: true,
                    onClose: OnClose
                }

            } else { //date time
                return  {
                    enableTime: true,
                    enableSeconds: true,
                    allowInput: true,
                    onClose: OnClose
                }
            } 
        }
   }
};
</script>

<style lang="scss">
  @import '~flatpickr/dist/flatpickr.css';
</style>