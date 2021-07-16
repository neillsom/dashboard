import { CREATOR_ID } from '@/config/labels-annotations';
import { MANAGEMENT, NORMAN } from '@/config/types';

export default {
  canCustomEdit() {
    return false;
  },

  canYaml() {
    return false;
  },

  canClone() {
    return false;
  },

  user() {
    return this.$rootGetters['management/byId'](MANAGEMENT.USER, this.userName);
  },

  nameDisplay() {
    return this.user?.nameDisplay;
  },

  projectId() {
    // projectName is in format `local:p-v679w`. project id's are in format `local/p-v679w`,
    return this.projectName?.replace(':', '/');
  },

  clusterId() {
    // projectName is in format `local:p-v679w`,
    return this.projectName.substring(0, this.projectName.lastIndexOf(':'));
  },

  project() {
    return this.$rootGetters['management/byId'](MANAGEMENT.PROJECT, this.projectId);
  },

  cluster() {
    return this.$rootGetters['management/byId'](MANAGEMENT.CLUSTER, this.clusterId);
  },

  projectDisplayName() {
    return this.project ? this.project.nameDisplay : this.projectName;
  },

  clusterDisplayName() {
    return this.cluster ? this.cluster.nameDisplay : this.clusterId;
  },

  userAvatar() {
    return {
      nameDisplay: this.nameDisplay,
      userName:    this.user.username,
      avatarSrc:   this.user.avatarSrc
    };
  },

  projectDetailLocation() {
    if (this.project) {
      return this.project.detailLocation;
    }

    const name = `c-cluster-product-resource-id`;

    const params = {
      resource:  MANAGEMENT.PROJECT,
      id:        this.projectId,
      product:   'explorer',
    };

    return { name, params };
  },

  clusterDetailLocation() {
    if (this.cluster) {
      return this.cluster.detailLocation;
    }

    const name = `c-cluster-product-resource-id`;

    const params = {
      resource:  MANAGEMENT.CLUSTER_ROLE_TEMPLATE_BINDING,
      id:        this.clusterName,
      product:   'explorer',
    };

    return { name, params };
  },

  roleTemplate() {
    return this.$rootGetters['management/byId'](MANAGEMENT.ROLE_TEMPLATE, this.roleTemplateName);
  },

  roleDisplay() {
    return this.roleTemplate.nameDisplay;
  },

  listLocation() {
    return { name: 'c-cluster-explorer-project-members' };
  },

  isSystem() {
    return !this.metadata.annotations[CREATOR_ID];
  },

  norman() {
    return this.$dispatch(`rancher/create`, {
      type:                  NORMAN.PROJECT_ROLE_TEMPLATE_BINDING,
      roleTemplateId:        this.roleTemplateName,
      userPrincipalId:       this.userPrincipalName,
      projectId:             this.projectName,
      projectRoleTemplateId: '',
      subjectKind:           'User',
      userId:                '',
      id:                    this.id?.replace('/', ':')
    }, { root: true });
  },

  save() {
    return async() => {
      const norman = await this.norman;

      return norman.save();
    };
  },

  remove() {
    return async() => {
      const norman = await this.norman;

      await norman.remove({ url: `/v3/projectRoleTemplateBindings/${ norman.id }` });
    };
  }
};
