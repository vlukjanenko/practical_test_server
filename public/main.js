function compare(a, b) {
	return a.name.localeCompare(b.name);
}

Vue.component('edit-client', {
	props: {
			client: Object,
			index: Number,
			providers: Array,
			parentPending: Boolean
		},
	data: function () {
	  return {
		candidate: {
			name: '',
			email: '',
			phone: '',
			providers: []
		},
		edit: false,
		providersList: [],
		newProvider: '',
		editedProvider: {
			name: String,
			id: Number,
			index: Number,
			enabled: false
		},
		pending: false
	  }
	},
	watch: {
		parentPending: function(newVal, oldVal) {
			this.pending = newVal;
		}
	},
	computed: {
		formatedPhone: {
		  get: function () {
			let formatedPhone = this.candidate.phone;
			if (formatedPhone.length > 2 && formatedPhone.length < 6) {
				formatedPhone = [formatedPhone.slice(0, 3), '-', formatedPhone.slice(3, formatedPhone.length)].join('');
			} else if (formatedPhone.length > 5) {
				formatedPhone = [formatedPhone.slice(0, 3), '-', formatedPhone.slice(3, 6), '-', formatedPhone.slice(6,  formatedPhone.length)].join('');
			}
			return formatedPhone;
		  },
		  set: function (newValue) {
			this.candidate.phone = newValue.replace(/-/g, '');
		  }
		}
	  },
	mounted() {
		if (this.client) {
			this.candidate.name = this.client.name;
			this.candidate.email = this.client.email;
			this.candidate.phone = this.client.phone;
			this.candidate.providers = this.client.providers.slice();
			this.edit = true;
		}
		this.providersList = this.providers.map(element => {
			if (this.candidate.providers.find(el => el.id === element.id)) {
				element.checked = true;
			} else {
				element.checked = false;
			}
			return element;
		});
		this.pending = this.parentPending;
	},
	methods: {
		isFormValid: function() {
			if (this.candidate.name.length < 2) {
				alert('Name required\nmin 2 chars');
				return false;
			}
			let email = new RegExp("^[^@]+@[^@]+\.[^@]+$");
			if (!email.test(this.candidate.email)) {
				alert('Valid email required');
				return false;
			}
			let phone = new RegExp("^[0-9]{10}[0-9]*$");
			if (!(phone.test(this.candidate.phone))) {
				alert('Valid phone number required\nmin 10 digits');
				return false;
			}
			return true;
		},
		addClient: function() {
			if (!this.isFormValid()) {
				return;
			}
			const providers = this.providersList
				.filter(element => element.checked)
				.map(element => { return {id: element.id}});
			this.candidate.providers = providers;
			this.pending = true;
			fetch('http://localhost:3000/api/clients', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify(this.candidate)
			})
			.then(response => {
				return (response.json());
			})
			.then(json => {
				if (json.message) {
					alert(json.message);
				} else {
					this.$emit('added-client', json);
				}
				this.pending = false;
			})
			.catch(e => {
				console.log(e);
				alert(e);
				this.pending = false;
			})
		},
		addProvider: function() {
			if(!this.newProvider) {
				return;
			}
			this.pending = true;
			fetch('http://localhost:3000/api/providers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify({name: this.newProvider})
			})
			.then(response => {
				return (response.json());
			})
			.then(json => {
				if (json.message) {
					alert(json.message);
				} else {
					this.providersList.push(json);
					this.newProvider = '';
					this.$emit('change-providers', this.providersList);
				}
				this.pending = false;
			})
			.catch(e => {
				console.log(e);
				alert(e);
				this.pending = false;
			})
		},
		editProviderEnable: function(index) {
			this.editedProvider.enabled = true;
			this.editedProvider.id = this.providersList[index].id;
			this.editedProvider.name = this.providersList[index].name;
			this.editedProvider.index = index;
			this.$nextTick(() => this.$refs.edfield[0].focus());
		},
		saveProvider: function() {
			if (!this.editedProvider.name) {
				return;
			}
			this.pending = true;
			fetch('http://localhost:3000/api/providers/' + this.editedProvider.id, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify(this.editedProvider)
			})
			.then(response => {
				return (response.json());
			})
			.then(json => {
				if (json.message) {
					alert(json.message);
				} else {
					this.providersList[this.editedProvider.index].name = json.name;
					this.editedProvider.enabled = false;
					this.$emit('change-providers', this.providersList);
				}
				this.pending = false;
			})
			.catch(e => {
				console.log(e);
				alert(e);
				this.pending = false;
			})
		},
		delProvider: function(i) {
			this.pending = true;
			fetch('http://localhost:3000/api/providers/' + this.providersList[i].id, {
				method: 'DELETE'
			})
			.then(response => response.json())
			.then(() => {
				this.providersList[i].checked = false;
				this.providersList.splice(i, 1);
				this.editedProvider.enabled = false;
				this.$emit('change-providers', this.providersList);
				this.pending = false;
			})
			.catch(e => {
				console.log(e);
				alert(e);
				this.pending = false;
			});
		},
		saveClient: function() {
			if (!this.isFormValid()) {
				return;
			}
			this.pending = true;
			const providers = this.providersList
				.filter(element => element.checked)
				.map(element => { return {id: element.id}});
			this.candidate.providers = providers;
			fetch('http://localhost:3000/api/clients/' + this.client.email, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify(this.candidate)
			})
			.then(response => {
				return (response.json());
			})
			.then(json => {
				if (json.message) {
					alert(json.message);
				} else {
					this.candidate.index = this.client.index;
					this.$emit('client-edited', this.candidate);
				}
				this.pending = false;
			})
			.catch(e => {
				console.log(e);
				alert(e);
				this.pending = false;
			})
		},
		delClient: function(index) {
			this.$emit('del-client', index);
		}
	}
	,
	template: `
	<form class="form-container">
	<div v-if="pending" class="processing-state">
	</div>
	<div class="bar top">
		<p v-if="!edit" class="title">New Client</p>
		<p v-else class="title">Edit Client</p>
	</div>
	<div class="inputs-container">
		<div class="line-container">
			<label class="form-label" for="name">Name:</label>
			<input class="big-input" type="text" id="name" v-model.trim="candidate.name" title="Client name">
		</div>
		<div class="line-container">
			<label class="form-label" for="email">Email:</label>
			<input class="big-input" type="text" id="email" v-model.trim="candidate.email" title="Client email">
		</div>
		<div class="line-container">
			<label class="form-label" for="phone">Phone:</label>
			<input class="big-input" type="tel" id="phone" v-model.trim="formatedPhone" title="Client phone">
		</div>
		<div class="line-container">
			<label class="form-label" for="provider">Providers:</label>
			<input class="big-input small-input" type="text" id="provider" v-model.trim="newProvider" title="Provider name">
			<button @click.prevent="addProvider">Add provider</button>
		</div>
		<div class="providers-list">
			<div v-for="(provider, index) in providersList" class="provider-line-container">
				<input type="checkbox" v-model="provider.checked">
				<input ref="edfield"
					@keyup.enter="saveProvider"
					@blur="editedProvider.enabled = false"
					@keyup.esc="editedProvider.enabled = false"
					v-if="editedProvider.enabled && editedProvider.index == index"
					:title="provider.name" type="text"
					v-model="editedProvider.name">
				</input>
				<label v-else :title="provider.name">{{ provider.name }}</label>

				<span class="spacer"></span>
				<i @click="editProviderEnable(index)" class="fa fa-edit"></i>
				<i @click="delProvider(index)"class="fa fa-trash"></i>
			</div>
		</div>
	</div>
	<div class="bar bottom">
		<button id="del" v-if="edit" @click.prevent="delClient(client.index)" >Delete Client</button>
		<span class="spacer"></span>
		<div class="bottom-right-buttons">
			<button v-on:click.prevent="$emit('cancel')">Cancel</button>
			<button v-if="!edit" v-on:click.prevent="addClient">Add Client</button>
			<button v-else @click.prevent="saveClient">Save Client</button>
		</div>
	</div>
</form>
	`
});

var app = new Vue({
	el: '#app',
	mounted() {
		this.loadClients();
		this.loadProviders();
	},
	data: {
		editClient: false,
		providers: [],
		clients: [],
		currentClient: null,
		pending: false
	},
	methods: {
		loadClients: function() {
			fetch('http://localhost:3000/api/clients')
			.then(response => response.json())
			.then(json => this.clients = json)
			.catch(e => {
				console.log(e);
				alert(e);
			});
		},
		loadProviders: function() {
			fetch('http://localhost:3000/api/providers')
			.then(response => response.json())
			.then(json => this.providers = json)
			.catch(e => {
				console.log(e);
				alert(e);
			});
		},
		addClient: function() {
			this.currentClient = null;
			this.editClient = true;
		},
		delClient: function(index) {
			this.pending = true;
			fetch('http://localhost:3000/api/clients/' + this.clients[index].email, {
				method: 'DELETE'
			})
			.then(response => response.json())
			.then(() => {
				this.clients.splice(index, 1);
				this.editClient = false;
				this.pending = false;
			})
			.catch(e => {
				console.log(e);
				alert(e);
				this.pending = false;
			});
		},
		openEditClient: function(client, index) {
			this.currentClient = client;
			this.currentClient.index = index;
			this.editClient = true;
		},
		addClientLocal: function(data) {
			this.clients.push(data);
			this.clients.sort(compare);
			this.editClient = false;
		},
		saveClientLocal: function(data) {
			this.clients[data.index] = data;
			this.clients.sort(compare);
			this.editClient = false;
		},
		changeProviders: function(data) {
			this.providers = data;
			this.providers.sort(compare);
		},
		formatedPhone: function(client) {
			let formatedPhone = client.phone;
			if (formatedPhone.length > 2 && formatedPhone.length < 6) {
				formatedPhone = [formatedPhone.slice(0, 3), '-', formatedPhone.slice(3, formatedPhone.length)].join('');
			} else if (formatedPhone.length > 5) {
				formatedPhone = [formatedPhone.slice(0, 3), '-', formatedPhone.slice(3, 6), '-', formatedPhone.slice(6,  formatedPhone.length)].join('');
			}
			return formatedPhone;
		},
		existProviders: function(client) {
			let lengthHolder = {value: 0};
			let providers =  this.providers.filter(provider => client.providers
				.find(clientProvider => clientProvider.id === provider.id))
				.map(el => ({name: el.name, len: lengthHolder}));
			lengthHolder.value = providers.length;
			return providers;
		},
	}
});
