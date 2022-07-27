<template>
<div>
  <ag-grid-vue
    style="width: 100%; height: calc(100vh - 3.25rem)"
    class="ag-theme-alpine"
    :columnDefs="columnDefs"
    :rowData="rowData"
    @grid-ready="onGridReady"
  />


</div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";

export default {
  name: "App",
  components: {
    "ag-grid-vue":AgGridVue,
  },  
  data: function () {
    return {
      rowData: [
          { make: 'tyt', exteriorColour: 'fg', interiorColour: 'bw', price: 35000 },
          // { make: 'frd', exteriorColour: 'bw', interiorColour: 'cb', price: 32000 },
          // { make: 'prs', exteriorColour: 'cb', interiorColour: 'fg', price: 72000 },
        ],
      columnDefs: [
        // {
        //   field: 'make',
        //   cellEditor: 'agSelectCellEditor',
        //   cellEditorParams: { values: carBrands },
        //   editable: true,
        //   filterParams: {
        //     valueFormatter: (params) => {
        //       return lookupValue(carMappings, params.value);
        //     },
        //   },
        //   valueFormatter: (params) => {
        //     return lookupValue(carMappings, params.value);
        //   },
        // },
        {
          field: 'exteriorColour',
          minWidth: 150,
          cellEditor: 'agRichSelectCellEditor',
          editable: true,
          cellEditorPopup: true,
          cellEditorParams: {
            values: colours,
            // cellRenderer: 'ColourCellRenderer',
          },
          valueFormatter: (params) => {
            console.log('valueFormatter')
            console.log(params.value)

            return lookupValue(colourMappings, params.value);
          },
          // valueParser: (params) => {
          //   console.log('valueParser')
          //   console.log(params.newValue)

          //   return lookupKey(colourMappings, params.newValue);
          // },

        },
      ]
    }
  }


};

function extractValues(mappings) {
  return Object.keys(mappings);
};

function lookupValue(mappings, key) {
  return mappings[key];
};

function lookupKey(mappings, name) {
  const keys = Object.keys(mappings);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (mappings[key] === name) {
      return key;
    }
  }
};


const carMappings = {
  tyt: 'Toyota',
  frd: 'Ford',
  prs: 'Porsche',
  nss: 'Nissan',
};

const colourMappings = {
  cb: 'Cadet Blue',
  bw: 'Burlywood',
  fg: 'Forest Green',
};

const carBrands = extractValues(carMappings);

const colours = extractValues(colourMappings);






</script>

<style lang="scss">
  @import "~ag-grid-community/dist/styles/ag-grid.css";
  @import "~ag-grid-community/dist/styles/ag-theme-alpine.css";

  * { margin: 0 }


</style>