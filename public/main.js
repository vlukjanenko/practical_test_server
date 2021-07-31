Vue.component('providers-list', {
	data: function() {
		return {
			provider: '',
			providers: [],
			editedProvider: '',
			edit: {
				enabled: true,
				id: -1
			}
		};
	},
	mounted() {
		fetch('http://localhost:3000/api/providers')
		.then(response => response.json())
		.then(json => this.providers = json);
	},
	methods:{
		addProvider: function() {
			this.provider = this.provider.trim();
			if(!this.provider) {
				return;
			}

			fetch('http://localhost:3000/api/providers', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify({name: this.provider})
			})
			.then(response => {
				return (response.json());
			})
			.then(json => {
				if (json.message) {
					alert(json.message);
				} else {
					this.providers.push(json);
					this.provider = '';
				}
			})
			.catch(e => {
				console.log(e);
				alert(e);
			})
		},
		delProvider: function(id, index) { //нафиг нам ид если есть индекс
			console.log('Come to del');
			fetch('http://localhost:3000/api/providers/' + id, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				  },
				body: JSON.stringify({name: this.provider})
			})
			.then(response => response.json())
			.then(() => this.providers.splice(index, 1));
		},
		editProvider: function(index) {
			this.editedProvider = this.providers[index];
			this.edit.enabled = true;
			this.edit.id = this.providers[index].id;
		}
	},
	template: `
	<div class="provider">
		<div class="input-and-list">
			<input class="form-element" type="text" id="provider" name="provider" v-model="provider" @keyup.enter="addProvider"/>
			<div class="providers-list">
			<ul>
			<li v-for="(provider, index) in providers">
				<input type="checkbox">
				<input class="provider-edit" type="text" v-if="edit.enabled && edit.id === provider.id" v-model="editedProvider.name"></input>
				<span class="provider-label" v-else > {{ provider.name }} </span>
				<span class="spacer"></span>
				<img @click="editProvider(index)" class="edit" src="edit.png"></img>
				<img @click="delProvider(provider.id, index)" class="edit" src="trash.png"></img>
			</li>
		</ul>
			</div>
		</div>
		<div id="add-provider">
			<button @click.prevent="addProvider">Add Provider</button>
		</div>
	</div>
	`
})

Vue.component('client', {
	data: function () {
	  return {

	  }
	},
	template: `
		<div class="edit-user">
			<div class="label-container">
				<label class="form-element" for="name">Name:</label>
				<label class="form-element" for="mail">E-mail:</label>
				<label class="form-element" for="phone">Phone:</label>
				<label class="form-element" for="providers">Providers:</label>
			</div>
			<div class="input-container">
				<input class="form-element" type="text" id="name" name="user_name" />
				<input class="form-element" type="email" id="mail" name="user_email" />
				<input class="form-element" type="phone" id="phone" name="user_phone" />
				<providers-list></providers-list>
			</div>
		</div>
	`
});

var app = new Vue({
	el: '#app',

	mounted() {
		fetch('http://localhost:3000/api/clients')
		.then(response => response.json())
		.then(json => this.table = json);
	},

	data: {
		addUser: false,
		editUser: false,
		table: []
	},
	computed: {
			getProviders() {
				return arrayIds => console.log(arrayIds[0]);
				/* return arrayIds.map(function(id){
					return this.providers.filter(p => p.id === id.id);
				}) */
			}
		},
	methods: {
		openAddUser: function(event) {
				this.editUser = false;
				this.addUser = true;
			},
		openEditUser: function(event) {
				this.editUser = true;
				this.addUser = false;
			},
		closeModal: function(event) {
				this.addUser = false;
				this.editUser = false;
			}
	}
});
