import { Component, Data, Prop } from '../../../index'
import { expect } from 'chai'
import * as Vue from 'vue'


describe('vue-class-component based test (ts)', () => {
  

  it('hooks', () => {
    let created = false
    let destroyed = false

    @Component()
    class MyComp {
      created() {
        created = true
      }
      destroyed() {
        destroyed = true
      }
    }

    const c = new MyComp()
    expect(created).to.be.true
    expect(destroyed).to.be.false
    c['$destroy']()
    expect(destroyed).to.be.true
  })

  it('methods', () => {
    let msg

    @Component()
    class MyComp {
      hello() {
        msg = 'hi'
      }
    }

    const c = new MyComp()
    c.hello()
    expect(msg).to.equal('hi')
  })

  it('computed', () => {
    @Component()
    class MyComp {
      @Data()
      a: number
      
      constructor(){
        this.a = 1
      }
      
      get b() {
        return this.a + 1
      }
    }

    const c = new MyComp()
    expect(c.a).to.equal(1)
    expect(c.b).to.equal(2)
    c.a = 2
    expect(c.b).to.equal(3)
  })

  it('props', () => {
    
    @Component()
    class MyComp {

      @Prop()
      message: string

      @Prop({
				default: 'meh',
        type: String
			})
      message2: any

      @Prop()
      message3: string

      @Prop()
      message4: string = 'yeah'

      @Prop({				
        type: String
			})
      message5: any = 'foo'

      @Prop({				
        type: String,
        default: "I'm win"
			})
      message6: any = 'kick'

      constructor() {
        this.message3 = 'what'
      }

    }

    const c = new MyComp()
    
    expect(c['$options']['props']).to.have.property('message')
    expect(c['$options']['props']).to.have.property('message2').that.has.property('default').that.equals('meh');
    expect(c['$options']['props']).to.have.property('message3').that.has.property('default').that.equals('what');
    expect(c['$options']['props']).to.have.property('message4').that.has.property('default').that.equals('yeah');
    expect(c['$options']['props']).to.have.property('message5').that.has.property('default').that.equals('foo');
    expect(c['$options']['props']).to.have.property('message6').that.has.property('default').that.equals("I'm win");

  })

  it('other options', (done) => {
    let v

    @Component({
      watch: {
        a: val => v = val
      }
    })
    class MyComp {
      @Data()
      a: number
      
      constructor(){
        this.a = 1
      }
    }

    const c = new MyComp()
    c.a = 2
    Vue.nextTick(() => {
      expect(v).to.equal(2)
      done()
    })
  })

  /**
   * Cant handle this
   */
  it('extending', function () {
    @Component()
    class Base {
      
      @Data()
      a: number
      
      constructor() {
        this.a = 1
      }
    }

    @Component()
    class A extends Base {
      
      @Data()
      b: number
      
      constructor() {
        super();
        this.b = this.a + 1
      }
    }

    const a = new A()
    expect(a.a).to.equal(1)
    expect(a.b).to.equal(2)
  })


})