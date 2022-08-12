<template>
<div v-html="markdown_help_msg"></div>
</template>

<script>
/*
The help message is markdown and is converted into html
*/


const MarkDownIt = require('markdown-it')
export default {

  props: {
    help_msg: {
      type: String,
      default: `# No Help Message`
    }
  },
  data () {
    return {
        markdown_help_msg: ""
    }
  },
  mounted() {
    let md = new MarkDownIt( {breaks: true} )
    this.markdown_help_msg = md.render(this.help_msg)
  }
}

    
</script>

