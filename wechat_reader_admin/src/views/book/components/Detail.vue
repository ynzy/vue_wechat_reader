<!--  -->
<template>
  <div class="detail">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '">
        <el-button v-if="!isEdit" @click.prevent.stop="showGuide">显示帮助</el-button>
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ isEdit ? '编辑电子书' : '新增电子书' }}
        </el-button>
      </sticky>
      <div class="detail-container">
        <el-row>
          <Warning />
          <el-col :span="24">
            <EbookUpload
              :fileList="fileList"
              :disabled="isEdit"
              @onSuccess="onUploadSuccess"
              @onRemove="onUploadRemove"
            />
          </el-col>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                书名
              </MDinput>
            </el-form-item>
            <div>
              <el-row>
                <el-col :span="12" class="form-item-author">
                  <el-form-item :label-width="labelWidth" label="作者：" prop="author">
                    <el-input v-model="postForm.author" placeholder="作者" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="出版社：" prop="publisher">
                    <el-input v-model="postForm.publisher" placeholder="出版社" style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="语言：" prop="language">
                    <el-input v-model="postForm.language" placeholder="语言" style="width: 100%" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="根文件：" prop="rootFile">
                    <el-input v-model="postForm.rootFile" placeholder="根文件" style="width: 100%" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="文件路径：" prop="filePath">
                    <el-input v-model="postForm.filePath" placeholder="文件路径" style="width: 100%" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="解压路径：" prop="unzipPath">
                    <el-input v-model="postForm.unzipPath" placeholder="解压路径" style="width: 100%" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="封面路径：" prop="coverPath">
                    <el-input v-model="postForm.coverPath" placeholder="封面路径" style="width: 100%" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label-width="labelWidth" label="文件名称：" prop="originalName">
                    <el-input v-model="postForm.originalName" placeholder="文件名称" style="width: 100%" disabled />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label-width="labelWidth" label="封面：" prop="cover">
                    <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                      <img :src="postForm.cover" class="preview-img" />
                    </a>
                    <span v-else>无</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item :label-width="labelWidth" label="目录：">
                    <div v-if="postForm.contentsTree && contentsTree.length > 0" class="contents-wrapper">
                      <el-tree :data="contentsTree" @node-click="onContentClick" />
                    </div>
                    <span v-else>无</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '../../../components/Sticky/index'
import EbookUpload from '../../../components/EbookUpload/index'
import MDinput from '../../../components/MDinput/index'
import Warning from './Warning'
import { createBook, getBook, updateBook } from '../../../api/book'
const defaultForm = {
  title: '', // 书名
  author: '', // 作者
  publisher: '', // 出版社
  language: '', // 语种
  rootFile: '', // 根文件路径
  cover: '', // 封面图片URL
  coverPath: '', // 封面图片路径
  fileName: '', // 文件名
  originalName: '', // 文件原始名称
  filePath: '', // 文件所在路径
  unzipPath: '', // 解压文件所在路径
  contents: [] // 目录
}
const fields = {
  title: '书名',
  author: '作者',
  publisher: '出版社',
  language: '语种'
}
export default {
  components: { Sticky, Warning, EbookUpload, MDinput },
  props: {
    isEdit: Boolean
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      // console.log(rule)
      if (value === '') {
        this.$message({
          message: fields[rule.field] + '为必传项',
          type: 'error'
        })
        callback(new Error(fields[rule.field] + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
      },
      postForm: Object.assign({}, defaultForm),
      fileList: [],
      contentsTree: [],
      labelWidth: '120px'
    }
  },
  created() {
    if (this.isEdit) {
      const { fileName } = this.$route.params
      this.getBookData(fileName)
    }
  },
  methods: {
    getBookData(fileName) {
      getBook({ fileName }).then(res => {
        this.setData(res.data)
      })
    },
    showGuide() {
      console.log('shou guide')
    },
    submitForm() {
      if (this.loading) return
      this.loading = true
      this.$refs['postForm'].validate(async (valid, fields) => {
        console.log(valid, fields)
        console.log(Object.keys(fields)[0])
        if (!valid) {
          this.$message.error(fields[Object.keys(fields)[0]][0].message)
          this.loading = false
        }
        const book = Object.assign({}, this.postForm)
        delete book.contents
        delete book.contentsTree

        if (!this.isEdit) {
          this.addBook(book)
        } else {
          this.editBook(book)
        }
      })
    },
    onSuccess(res) {
      const { msg } = res
      this.$notify({
        title: '操作成功',
        message: msg,
        type: 'success',
        duration: 2000
      })
      this.loading = false
    },
    addBook(book) {
      createBook(book)
        .then(res => {
          this.onSuccess(res)
          this.setDefatult()
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    editBook(book) {
      updateBook(book)
        .then(res => {
          this.onSuccess(res)
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    setData(data) {
      this.postForm = Object.assign({}, this.postForm, data)
      this.contentsTree = data.contentsTree
      // console.log(data.contentsTree)
      this.fileList = [{ name: data.originalName || data.fileName, url: data.url }]
    },
    setDefatult() {
      // this.postForm = Object.assign({}, defaultForm)
      this.contentsTree = []
      this.fileList = []
      this.$refs['postForm'].resetFields()
    },
    onUploadSuccess(data) {
      console.log('onUploadSuccess')
      // console.log(data)
      this.setData(data)
    },
    onUploadRemove() {
      console.log('onUploadRemove')
      this.setDefatult()
    },
    onContentClick(data) {
      console.log(data)
      const { text } = data
      if (text) {
        window.open(text)
      }
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
.detail {
  position: relative;
  .detail-container {
    padding: 40px 50px 20px;
    .preview-img {
      width: 200px;
      height: 270px;
    }
  }
}
</style>
