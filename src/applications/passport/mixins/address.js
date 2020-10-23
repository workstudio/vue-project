import {fetchData} from '@/applications/mixins/fetchData';
import areaList from "@/data/area.js";

export const address = {
  'mixins': [fetchData],
  data() {
    return {
      areaList: areaList,
      modelCode: 'UserAddress',
      currentContact: [],
      showAddressList: false,
      showEdit: false,
      addressInfo: {},
      searchResult: [],
      isEdit: false,
    }
  },
  computed: {
    addressDatas() {
      return this.formatedInfos(this.fetchMylist);
    },
    chosenContactId: {
      get: function() { return this.currentContact.id;}, 
      set: function(val) {
        //let cItem = this.addressDatas.filter(item => item.id == val);
        //this.$store.commit('currentContact', cItem);
      }
    },
    cardType() {
      return this.addressDatas.length > 0 ? "edit" : "add";
    },
  },
  methods: {
    // 添加联系人
    onAdd() {
      this.isEdit = false;
      this.showEdit = true;
    },

    // 编辑联系人
    onEdit(item) {
      this.addressInfo = item;
      this.isEdit = true;
      this.showEdit = true;
    },
    // 保存联系人
    onSave(info) {
      this.showEdit = false;
      this.showAddressList = false;
      info.consignee = info.name;
      info.address = info.addressDetail;

      let action = this.isEdit ? 'edit' : 'create';
      this.cModel.$create({params: {action: action}, data: this.formatInfo(info, 'tosys')});
    },

    onDelete(info) {
      this.showEdit = false;
      this.cModel.$create({params: {action: 'remove'}, data: info});
    },

    // 选中联系人
    onSelect(item) {
      this.showAddressList = false;
      this.currentContact = item;
    },
    onChangeDetail(val) {},
    formatInfo(info, type) {
      if (type == 'tofront') {
        return {
          'id': info.id,
          'tel': info.mobile,
          'name': info.consignee,
          'address': info.addressShow,
          'areaCode': info.county_code,
          'isDefault': Boolean(info.is_default),
          'addressDetail': info.address
        };
	  }
      return {
        'id': info.id,
        'mobile': info.tel,
        'consignee': info.name,
        'address': info.addressDetail,
        'county_code': info.areaCode,
        'is_default': Boolean(info.isDefault),
      }
    },

    formatedInfos(infos) {
      if (!infos || !infos.length) {
        return [];
      }
      let list = [];
      let i = 0;
      let cId = this.currentContact.id ? this.currentContact.id : null;
      for (let key in infos) {
        let cAddress = infos[key];
        list[i] = this.formatInfo(cAddress, 'tofront');
        if (!this.currentContact.id && cAddress.is_default) {
          this.currentContact = list[i];
        }
        i++;
      }
      if (!this.currentContact.id) {
        this.currentContact = list[0];
      }
      return list;
    },
    resultFormat(action, rDatas) {
      if (action == 'create' || action == 'edit' || action == 'remove') {
        this.currentContact = action == 'remove' ? {} : this.formatInfo(rDatas, 'tofront');
        this.fetchRequest(this.cModel, {params: {action: 'mylist'}});
      } else {
        return rDatas;
      }
    },
  },
}
