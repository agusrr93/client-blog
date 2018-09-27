/*eslint-disable*/
<template>
  <div class="card mb-4 my-5 mx-5 px-3">
    <div class="card-body">
      <h3 class="card-title text-center display-10">{{ this.article.title}}</h3>
      <hr>
      <p class="card-text" align="justify">{{ this.article.content }}</p>
    </div>
    <div class="card-footer text-muted mb-5">
      Posted on {{ this.created }} by {{ this.name }}
    </div>

    <div class="my-3" v-if="datalocal">
      <div class="form-group row">
        <div class="col-lg-10">
          <textarea class="form-control" placeholder="Comment........." v-model="commented"></textarea>
          <br>
          <button type="button" class="btn btn-primary" v-on:click="addComment()">comment</button>
        </div>
      </div>
    </div>

     <h5>Comments Session: </h5>
    <div v-for="(item, index) in comment" v-bind:key="index">
      <center>
        <hr>
        <i>{{usercomment[index]}}</i>
        <p>{{item.comment}}</p>
        <button type="button" class="btn btn-default" v-if="isHim[index]" v-on:click="deleted(comment_id[index])">Delete</button>
        <hr>
        <br><br>
      </center>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'detail',
  props: ['id', 'datalocal'],
  data: function () {
    return {
      article: {},
      name: '',
      created: '',
      commented: '',
      comment:[],
      usercomment:[],
      isHim:[],
      comment_id:[]
    }
  },methods:{
      addComment () {
      let self = this

      axios({
        method: 'post',
        url: `http://35.197.157.128/comments/${this.id}`,
        data: {
          comment: this.commented
        },
        headers: {
          token: this.datalocal.token
        }
      })
       .then(response => {
          this.comment.push(response.data)
          this.getcomment()
          location.reload()
        })
        .catch(err => {
          if (err.response) {
            alert(err.response.data.error)
          } else {
            console.log(err)
          }
      })
    },deleted(value){
        let self = this
        axios({
          method: 'delete',
          url: `http://35.197.157.128/comments/${value}`,
          headers: {
            'token': this.datalocal.token
          }
        })
        .then(response => {
            let id=response.data.id            
            self.comment.forEach((element,index) => {
                if(element._id==id){
                    self.comment.splice(index,1)
                }
            });
            location.reload()
        })
        .catch(err => {
           if (err.response) {
             alert(err.response.data.error)
           } 
           else {
             console.log(err)
          }
        })
    },getcomment(){
        let self = this
        axios({
          method: 'get',
          url: `http://35.197.157.128/articles/${this.id}`
        })
          .then(response => {
             var date=new Date(response.data.date)
              self.created =response.data.date
              self.name = response.data.userId.name
              self.article = response.data
              self.created =date.toISOString().substring(0,10)
              self.comment=response.data.comments
              axios({
                method: 'get',
                url: `http://localhost:3000/comments/${self.id}`
              }).then(response => {
                
                for(var i=0;i<response.data.length;i++){
                    self.usercomment[i]=response.data[i].userId.email
                    self.comment_id[i]=response.data[i]._id
                    if(self.usercomment[i]==this.datalocal.email){
                        this.isHim.push(true)
                    }else{
                      this.isHim.push(false)
                    }
                }
              }).catch(err=>{
                alert(err)
              })
        })
        
        .catch(err => {
          alert(err)
        })
      }
  },
  created () {
    let self = this

    axios({
      method: 'get',
      url: `http://35.197.157.128/articles/${this.id}`
    })
      .then(response => {
          var date=new Date(response.data.date)
          
          self.created =response.data.date
          self.name = response.data.userId.name
          self.article = response.data
          self.created =date.toISOString().substring(0,10)
          self.comment=response.data.comments
          axios({
            method: 'get',
            url: `http://35.197.157.128/comments/${self.id}`
          }).then(response => {
            for(var i=0;i<response.data.length;i++){
                self.usercomment[i]=response.data[i].userId.email
                self.comment_id[i]=response.data[i]._id
                if(self.usercomment[i]==this.datalocal.email){
                    this.isHim.push(true)
                }else{
                  this.isHim.push(false)
                }
            }
            console.log(this.isHim)
          }).catch(err=>{
            alert(err)
          })
      })
      .catch(err => {
        alert(err)
      })
  },
  watch: {
    id: function () {
      let self = this

      axios({
        method: 'get',
        url: `http://35.197.157.128/articles/${this.id}`
      })
        .then(response => {
          var date=new Date(response.data.date)

          self.created =date.toISOString().substring(0,10)
          self.name = response.data.userId.name
          self.article = response.data
          self.comment=response.data.comments
          axios({
            method: 'get',
            url: `http://35.197.157.128/comments/${self.id}`
          }).then(response => {
            for(var i=0;i<response.data.length;i++){
                self.usercomment[i]=response.data[i].userId.email
                self.comment_id[i]=response.data[i]._id
                if(self.usercomment[i]==this.datalocal.email){
                    this.isHim.push(true)
                }else{
                  this.isHim.push(false)
                }
            }
          }).catch(err=>{
            alert(err)
          })  
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

