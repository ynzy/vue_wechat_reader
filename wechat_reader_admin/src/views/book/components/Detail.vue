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
            <!-- 编写具体表单控件 -->
            <EbookUpload
              :fileList="fileList"
              :disabled="isEdit"
              @onSuccess="onUploadSuccess"
              @onRemove="onUploadRemove"
            />
          </el-col>
          <el-col :span="24">
            <!-- 编写具体表单控件 -->
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '../../../components/Sticky/index'
import EbookUpload from '../../../components/EbookUpload/index'
import Warning from './Warning'
export default {
  components: { Sticky, Warning, EbookUpload },
  props: {
    isEdit: Boolean
  },
  data() {
    return {
      loading: false,
      rules: {},
      postForm: {},
      fileList: []
    }
  },
  methods: {
    showGuide() {
      console.log('shou guide')
    },
    submitForm() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 3000)
    },
    onUploadSuccess() {
      console.log('onUploadSuccess')
    },
    onUploadRemove() {
      console.log('onUploadRemove')
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
