import { Component, Data, Prop, Watch, Action, Getter } from '../../../index'
import { expect } from 'chai'
import * as Vue from 'vue'


describe('deprecating data extending test', () => {


	it('simple data', () => {

		@Component()
		class Base extends Vue {
			msg: string = 'hello'
		}

		@Component() class App extends Base { }

		var app = new App();
		expect(app['$options']['data']()).to.have.property('msg').that.equals('hello')

	})

	it('should not conflit with methods', () => {

		@Component()
		class Base extends Vue {

			msg() {
				console.log('bar');
			}

			data1: string = 'hi'
		}

		@Component() class App extends Base { }

		var app = new App();

		expect(app['$options']['data']()).to.have.property('data1').that.equals('hi')
		expect(app['$options']['data']()).to.not.have.property('msg')

	})

	it('should not conflit with props', () => {

		@Component()
		class Base extends Vue {

			@Prop()
			msg: string = 'hello'

			@Prop()
			emptyProp: any

			data1: string = 'hi'
		}

		@Component() class App extends Base { }
		var app = new App();

		expect(app['$options']['data']()).to.have.property('data1').that.equals('hi')
		expect(app['$options']['data']()).to.not.have.property('msg')
		expect(app['$options']['data']()).to.not.have.property('emptyProp')

	})

	it('should not conflit with watch', () => {

		@Component()
		class Base extends Vue {

			@Prop()
			msg: string = 'hello'

			data1: string = 'hi'

			@Watch('data1')
			data_wacther() {
				console.log('bar');
			}
		}

		@Component() class App extends Base { }

		var app = new App();

		expect(app['$options']['data']()).to.have.property('data1').that.equals('hi')
		expect(app['$options']['data']()).to.not.have.property('msg')
		expect(app['$options']['data']()).to.not.have.property('data_wacther')

	})

	it('should not conflit with getter setter property', () => {

		@Component()
		class Base extends Vue {
			
			get msg() {
				return this.data1;
			}

			set msg(val) {
				this.data1 = val;
			}

			data1: string = 'hi'
			
		}

		@Component() class App extends Base { }

		var app = new App();

		expect(app['$options']['data']()).to.have.property('data1').that.equals('hi')
		expect(app['$options']['data']()).to.not.have.property('msg')

	})

	it('should not conflit with getter and action', () => {

		// Vuex ------------------------------------------------------

		const state = {
			count: 0
		}

		const mutations = {
			INCREMENT(state, num) {
				state.count += num
			}
		}

		const actions = {
			getCount: (state) => {
				return state.count;
			},
			addCount: ({dispatch, state}, num) => {
				dispatch('INCREMENT', num)
			}
		}

		// Component -------------------------------------------------

		@Component({
			template: '<div id="foo"><div class="text">{{count}}</div><button @click="add()" class="btn">test</button></div>'
		})
		class Base {

			data1: string = 'hi'

			@Getter(actions.getCount)
			count: number = 1

			// declare empty function with appropriate parameter(s) to hook vuex action
			@Action(actions.addCount)
			increment(num) { }

			add() {
				this.increment(5);
			}

		}

		@Component() class App extends Base { }

		var app = new App();

		expect(app['$options']['data']()).to.have.property('data1').that.equals('hi')
		expect(app['$options']['data']()).to.not.have.property('count')
		expect(app['$options']['data']()).to.not.have.property('increment')
		expect(app['$options']['data']()).to.not.have.property('add')

	})



});