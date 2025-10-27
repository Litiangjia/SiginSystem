import { defineStore } from 'pinia';

export const adminToken = defineStore('schoolTokenAdmin', {
  state: () => ({
    token: null as string | null,
    tokenName:'satoken' as string,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setToken(token: string | null) {
      this.token = token;
    },

    setTokenName(tokenName: string) {
      this.tokenName = tokenName;
    },

    clearToken() {
      this.token = null;
      this.tokenName = "satoken";
    },

    updateToken(newToken: string) {
      this.token = newToken;
    },

    updateTokenName(newTokenName: string) { //不一定用到，可以不用管
      this.tokenName = newTokenName;
    },
  },

  persist: {
    key: 'token-admin-store',
    storage: localStorage,
    pick: ['token','tokenName'],
  },
});
