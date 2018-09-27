<template>
  <div class="my-5">

    <div class="card" v-if=datalocal>
      <div class="card-header">
        WELCOME TO DASHBOARD
      </div>
      <div class="card-body">
        <h5 class="card-title">{{datalocal.email}}</h5>
        <p class="card-text">Wish you enjoy this blog</p>
      </div>
    </div><br>
    <button type="button" class="btn btn-primary mb-3" v-if="datalocal" data-toggle="modal" data-target="#addArticleModal">Add Article</button>
    
    <h2>List Articles</h2>
    <div class="list-group">
      <div class="list-group-item" v-for="article in articles" :key="article._id">
        <router-link class="sidebar-title" :to="{ name: 'article-detail', params: {id: article._id} }">{{ article.title }}</router-link>
        <h6>By: {{ article.userId.name }}</h6>
         <a v-if="article.isHim" v-on:click="deleted(article._id)"><i class="fa fa-trash" aria-hidden="true"></i></a>||
         <a v-if="article.isHim" data-toggle="modal" data-target="#editModal" v-on:click="setter(article._id)"><i class="fa fa-floppy-o" aria-hidden="true"></i></a>
         ||{{article.comments.length}}<i class="fa fa-comments" aria-hidden="true"></i>
      </div>
    </div>
    
    <!-- Modal Add Article -->
    <div class="modal fade" id="addArticleModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Add Article</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">

            <div class="container">
              <form>
                <div class="form-group">
                  <label for="title">Title:</label>
                  <input type="text" class="form-control" v-model="title" required>
                </div>
                <div class="form-group">
                  <label for="content">Content:</label>
                  <textarea rows="8" cols="80" v-model="content" class="form-control"></textarea>
                </div>
              </form>

            </div>

          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="addArticle">Add Article</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>

     <div class="modal fade" id="editModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Edit Article</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">

            <div class="container">
              <form>
                <div class="form-group">
                  <label for="title">Title:</label>
                  <input type="text" class="form-control" v-model="edited_title" required>
                </div>
                <div class="form-group">
                  <label for="content">Content:</label>
                  <textarea rows="8" cols="80" v-model="edited_content" class="form-control"></textarea>
                </div>
              </form>

            </div>

          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="update">Add Article</button>
            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'sidebar',
  props: ['datalocal'],
  data: function () {
    return {
      articles: [],
      title: '',
      content: '',
      edited_title:'',
      edited_content:'',
      editable:''
    }
  },
  methods: {
    addArticle () {
      let self = this

      axios({
        method: 'post',
        url: 'http://35.197.157.128/articles',
        data: {
          title: this.title,
          content: this.content
        },
        headers: {
          token: this.datalocal.token
        }
      })
        .then(response => {
          response.data.isHim=true
          self.articles.push(response.data)
        })
        .catch(err => {
          if (err.response) {
            alert(err.response.data.error)
          } else {
            console.log(err)
          }
        })
    },deleted (value){
       let self = this
        axios({
          method: 'delete',
          url: `http://35.197.157.128/articles/${value}`,
          headers: {
            'token': this.datalocal.token
          }
        })
        .then(response => {
            let id=response.data.id

            self.articles.forEach((element,index) => {
                if(element._id==id){
                  self.articles.splice(index,1)
                }
            });
        })
        .catch(err => {
           if (err.response) {
             alert(err.response.data.error)
           } 
           else {
             console.log(err)
          }
        })
    },update() {
      let self = this

      axios({
        method: 'put',
        url: `http://35.197.157.128/articles/${self.editable}`,
        data: {
          title: this.edited_title,
          content: this.edited_content
        },
        headers: {
          token: this.datalocal.token
        }
      })
        .then(response => {
            location.reload()
        })
        .catch(err => {
          if (err.response) {
            alert(err.response.data.error)
          } else {
            console.log(err)
          }
        })
    },setter(value){
        this.editable=value
    }
  },
  created () {
    let self = this

    axios({
      method: 'get',
      url: 'http://35.197.157.128/articles/author'
    })
      .then(response => {
        self.articles = response.data

        for(var i=0;i<self.articles.length;i++){
         
          if(this.datalocal.email==self.articles[i].userId.email)
          {
              self.articles[i].isHim=true
          }
          else{
              self.articles[i].isHim=false
          }
        }   
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style scoped>
.sidebar-title {
  font-size: 1.5rem;
}
</style>
