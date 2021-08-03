
Vue.component('edit-client', {
	props: {
			client: Object,
			index: Number,
			providers: Array
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
		newProvider: ''
	  }
	},
	/* computed: {
		isFormValid: function() {
			let re = new RegExp("[0-9]{3}-[0-9]{3}-[0-9]{4}");
			return re.test(this.candidate.phone) && this.candidate.phone.length === 12;
		}
	}, */
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
			let phone = new RegExp("[0-9]{3}-[0-9]{3}-[0-9]{4}");
			if (!(phone.test(this.candidate.phone) && this.candidate.phone.length === 12)) {
				alert('Phone number required\nformat: ###-###-####');
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
			})
			.catch(e => {
				console.log(e);
				alert(e);
			})
		},
		addProvider: function() {
			if(!this.newProvider) {
				return;
			}

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
			})
			.catch(e => {
				console.log(e);
				alert(e);
			})
		},
		delProvider: function(i) {
			fetch('http://localhost:3000/api/providers/' + this.providersList[i].id, {
				method: 'DELETE'
			})
			.then(response => response.json())
			.then(() => {
				this.providersList[i].checked = false;
				this.providersList.splice(i, 1);
				this.$emit('change-providers', this.providersList);
			});
		},
		saveClient: function() {
			if (!this.isFormValid()) {
				return;
			}
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
					this.candidate.index = this.client.index; // тут сомненья
					this.$emit('client-edited', this.candidate);
				}
			})
			.catch(e => {
				console.log(e);
				alert(e);
			})
		}
	}
	,
	template: `
	<form class="form-container">
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
			<input class="big-input" type="tel" id="phone" v-model.trim="candidate.phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required title="Client phone">
		</div>
		<div class="line-container">
			<label class="form-label" for="provider">Providers:</label>
			<input class="big-input small-input" type="text" id="provider" v-model.trim="newProvider" title="Provider name">
			<button @click.prevent="addProvider">Add provider</button>
		</div>
		<div class="providers-list">
			<div v-for="(provider, index) in providersList" class="provider-line-container">
				<input type="checkbox" v-model="provider.checked">
				<label :title="provider.name">{{ provider.name }}</label>
				<span class="spacer"></span>
				<i class="fa fa-edit"></i>
				<i @click="delProvider(index)"class="fa fa-trash"></i>
			</div>
			<!-- <div class="provider-line-container">
				<input type="checkbox">
				<input title="Provider 2" type="text" value="Provider 2"></input>
				<span class="spacer"></span>
				<i class="fa fa-edit"></i>
				<i class="fa fa-trash"></i>
			</div>
			<div class="provider-line-container">
				<input type="checkbox">
				<label title="Provider 1 with very long name">Provider 1 with very long name</label>
				<span class="spacer"></span>
				<i class="fa fa-edit"></i>
				<i class="fa fa-trash"></i>
			</div>
			<div class="provider-line-container">
				<input type="checkbox">
				<label title="Provider 1 with very long name">Provider 1 with very long name</label>
				<span class="spacer"></span>
				<i class="fa fa-edit"></i>
				<i class="fa fa-trash"></i>
			</div>
			<div class="provider-line-container">
				<input type="checkbox">
				<label title="Provider 1 with very long name">Provider 1 with very long name</label>
				<span class="spacer"></span>
				<i class="fa fa-edit"></i>
				<i class="fa fa-trash"></i>
			</div> -->
		</div>
	</div>
	<div class="bar bottom">
		<button id="del" v-if="edit" @click.prevent="$emit('del-client', client.index)" >Delete Client</button>
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
		currentClient: null
	},

	computed: {

		},
	methods: {
		loadClients: function() {
			fetch('http://localhost:3000/api/clients')
			.then(response => response.json())
			.then(json => this.clients = json);
		},
		loadProviders: function() {
			fetch('http://localhost:3000/api/providers')
			.then(response => response.json())
			.then(json => {
				this.providers = json});
		},
		addClient: function() {
			this.currentClient = null;
			this.editClient = true;
		},
		delClient: function(index) {
			fetch('http://localhost:3000/api/clients/' + this.clients[index].email, {
				method: 'DELETE'
			})
			.then(response => response.json())
			.then(() => {
				this.clients.splice(index, 1);
				this.editClient = false;
			});
		},
		openEditClient: function(client, index) {
			this.currentClient = client;
			this.currentClient.index = index;
			this.editClient = true;
		},
		addClientLocal: function(data) {
			this.clients.push(data);
			this.editClient = false;
		},
		saveClientLocal: function(data) {
			this.clients[data.index] = data;
			this.editClient = false;
		},
		changeProviders: function(data) {
			console.log("come")
			this.providers = data;
		},
		existProviders: function(client) {
			let providers = [];

			for (let i = 0; i < client.providers.length; i++) {
				let provider = this.providers.find(p => client.providers[i].id === p.id);
				if (provider) {
					if (i < client.providers.length - 1) {
						providers.push(provider.name + ", ");
					} else {
						providers.push(provider.name);
					}
				}
			}
			return providers;
		}
	}
});
