
        <el-form-item v-if="item.type === 'dropdown'" :label="baseFields[index]" prop="index">
          <el-select v-model="inputInfos.type" class="filter-item" placeholder="Please select">
            <el-option v-for="(option, optionIndex) in item.infos" :key="optionIndex" :label="option" :value="optionIndex" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'radio'" :label="baseFields[index]" prop="index">
          <el-radio-group :v-model="inputInfos[index]">
            <el-radio v-for="(rOption, rOptionIndex) in item.infos" :key="rOptionIndex" :label="rOptionIndex">{{rOption}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'radio-text'" :label="baseFields[index]" prop="index">
          <el-radio-group v-model="inputInfos[index]">
            <el-radio v-for="(rOption, rOptionIndex) in item.infos" :key="rOptionIndex" :label="rOptionIndex">{{rOption}}</el-radio>
          </el-radio-group>
          <el-input placeholder="请输入自定义内容" v-model="inputExts[index]" clearable> </el-input>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'city'" :label="$t('table.date')" prop="timestamp">
          <el-date-picker v-model="inputInfos.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item v-else-if="item.type === 'city'" :label="$t('table.status')">
          <el-select v-model="inputInfos.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'city'" :label="$t('table.importance')">
          <el-rate v-model="inputInfos.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item v-else-if="item.type === 'city'" :label="$t('table.remark')">
          <el-input v-model="inputInfos.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
  <el-select v-else-if="item.type === 'download-search'"
    v-model="value"
    multiple
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
