/// <reference types="cypress" />
/// <reference types = "cypress-iframe"/>

import 'cypress-iframe'
describe('Amazon tests',()=>{
    beforeEach(()=>{

        //visiting amazon.in and logging in
        cy.visit('https://www.amazon.in')
    
        cy.get('#nav-link-accountList-nav-line-1').click()
    
        cy.get('#ap_email').type('<email>')
          .should('have.value','<expected_email>')
    
        cy.get('.a-button-inner > #continue').click()
    
        cy.get('#ap_password').type('<password')
          
        cy.get('#signInSubmit').click()

    })

    it("Click on today's deals",()=>{

      //click on third deal in today's deals
       
        cy.get('.first-carousel > div:nth-child(1) > ul:nth-child(1)> li:nth-child(3)>').children().get('div.deals-shoveler-card-image > a').eq(2)
          .click()
 
      // getting first item in third category

        cy.get('div.sg-col-4-of-12:nth-child(1) > div:nth-child(1) > span:nth-child(1) > div:nth-child(1) > div:nth-child(1) > span:nth-child(2) > a:nth-child(1)')
        .invoke('attr','href').then(link=>{
          cy.visit('https://www.amazon.in'+link)
        })

        //setting min quantities required to 1

        cy.get('.a-dropdown-container > #quantity').select('1')

        //add to cart

        cy.get('#add-to-cart-button').click({force: true})

        //visit shopping cart

        cy.get('#nav-cart').invoke('attr','href').then(cart=>{
            cy.visit(cart)
        })

        //asserting min quantities required is 1

        cy.get('select[name="quantity"').should('include.value','1')

        
    })

    it("Search for Mobiles",()=>{

        //type mobiles in search box
        cy.get('#twotabsearchtextbox').type('mobiles{enter}')

        //scroll to bottom

        cy.scrollTo(0,5000)
       
        //get the last item and log details to console
        cy.get(`[data-asin^="B0"]`).last().children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0)
          .children().eq(1)
          .children().eq(1).children().eq(0).children().eq(0).children().eq(1).children().eq(0).children().eq(0)
         .then($ele=>{
            cy.log($ele.text())
          })

          //visit last item
          cy.get(`[data-asin^="B0"]`).last().children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0)
            .children().eq(0).children().eq(1).children().eq(0).children().eq(0).children().eq(0).children().eq(0).children().eq(0)
            .invoke('attr','href').then(link=>{
              cy.visit('https://www.amazon.in'+link)
            })
      
      })
     

    it.only("Amazon prime delivery",()=>{
      
      //click on mobiles category

        cy.get('[href="/mobile-phones/b/?ie=UTF8&node=1389401031&ref_=nav_cs_mobiles_9292c6cb7b394d30b2467b8f631090a7"]').click()

        //check the box for prime

        cy.get('#s-refinements > div:nth-child(3) > ul > li > span > a > div > label > input[type=checkbox]').check({force:true})

        //click on prime icon

        cy.get('.a-icon-prime').click()

        //visit the first item and log details to console

        cy.get('#search > div.s-desktop-width-max.s-opposite-dir > div > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(1) > div > span > div > div > div > div > span > a')
           .invoke('attr','href').then(link=>{
             cy.visit('https://www.amazon.in'+link)

             cy.get('#ddmDeliveryMessage > b').then($ele=>{
               cy.log($ele.text())

             })

           })

        //add item to cart
        cy.get('#add-to-cart-button').click() 

        //go to shopping cart
           
        cy.get('#hlb-view-cart-announce').click()

        //click on proceed to buy

        cy.get('#sc-buy-box-ptc-button > .a-button-inner > .a-button-input').click()

        //log delivery status details to console

        cy.get('.ship-to-this-address > .a-button-inner > [data-testid]').click()
        cy.get('.description').then($ele=>{
          cy.log($ele.text())
        })

    })

    it("Navigation",()=>{

      //click on hamburger menu
      cy.get('.hm-icon').click()

      //click on mobiles,computers category

      cy.get(':nth-child(15) > .hmenu-item > div').click()

      //click on all mobile phones category

      cy.get('.hmenu-visible > :nth-child(3) > .hmenu-item').click({force:true, multiple:true})
      
      //back to home page
      cy.get('#nav-logo-sprites').click()
    })

    it("Orders",()=>{

      //click on orders
      cy.get('#nav-orders > .nav-line-2').click()

      //select last year in dropdown

      cy.get('#orderFilter').select('year-2020',{force:true})
    })

    it("New Payment",()=>{

      //click on user account
      cy.get('#nav-link-accountList').click() 

      //click on  payment options

      cy.get(':nth-child(3) > :nth-child(2) > .ya-card__whole-card-link > .a-box').click()

      //click on add new credit or debit card 

      cy.get('#cpefront-mpo-widget > div > div.a-section.a-spacing-base.pmts-add-payment-instrument').children().eq(2).children()
      .eq(1).children().eq(0).children().eq(1).children().eq(0).children().eq(0).children().eq(0).children().eq(0).invoke('attr','id')
        .then(payId=>{
         const pay=payId
         const hash=payId.slice(0,10)
         cy.get('#'+pay+' > .a-button-inner > .a-button-input').click()

        })

        //asserting payment details
        cy.get('#cpefront-mpo-widget > div > form > div > div > div.a-row.a-spacing-top-mini.a-ws-row').children().eq(1)
          .invoke('attr','data-pmts-component-id').then(id=>{
            cy.get('#cpefront-mpo-widget > div > form > div > div > div.a-row.a-spacing-top-mini.a-ws-row > div.a-box-group.pmts-portal-component.pmts-portal-components-'+id+' > div > a > span > div > div > div.a-fixed-left-grid-col.a-col-right > div > div > div.a-fixed-right-grid-col.a-col-left > span.a-size-base.pmts-instrument-number-tail > span:nth-child(2)')
              .should('have.text','ending in 6816')

            cy.get('#cpefront-mpo-widget > div > form > div > div > div.a-row.a-spacing-top-mini.a-ws-row > div.a-box-group.pmts-portal-component.pmts-portal-components-'+id+' > div > a > span > div > div > div.a-fixed-left-grid-col.a-col-right > div > div > div.a-fixed-right-grid-col.a-col-right > div > span')
              .should('have.text','01/2024')
            
            cy.get('#cpefront-mpo-widget > div > form > div > div > div.a-row.a-spacing-top-mini.a-ws-row > div.a-box-group.pmts-portal-component.pmts-portal-components-'+id+' > div > div > div.a-fixed-right-grid > div > div.a-fixed-right-grid-col.a-col-left > div')
              .should('have.text','Name on cardsanjana')
      
          })
      
     })
   

    it("New Delivery Address",()=>{

       //click on user account      
      cy.get('#nav-link-accountList').click() 

      //click on addresses

      cy.get(':nth-child(3) > :nth-child(1) > .ya-card__whole-card-link > .a-box > .a-box-inner').click()

      //click on add address

      cy.get('#ya-myab-address-add-link > .a-box').click()

      //fill the form for adding new address

      cy.get('#address-ui-widgets-enterAddressFullName').type('Sanjana')

      cy.get('#address-ui-widgets-enterAddressPhoneNumber').type('9876543210')

      cy.get('#address-ui-widgets-enterAddressPostalCode').type('500029')

      cy.get('#address-ui-widgets-enterAddressLine1').type('10-23/B')

      cy.get('#address-ui-widgets-enterAddressLine2').type('Narayanaguda')

      cy.get('#address-ui-widgets-landmark').type('Near Apollo hospitals')

      cy.get('#address-ui-widgets-enterAddressStateOrRegion-dropdown-nativeId').select('TELANGANA',{force:true})

      cy.get('#address-ui-widgets-enterAddressFormContainer > div.a-section > div.a-section.a-spacing-base.adddress-ui-widgets-form-field-container.address-ui-widgets-desktop-form-field > span > select')
        .select('RES',{force:true})

      cy.get('#address-ui-widgets-form-submit-button > .a-button-inner > .a-button-input').click()

      //asserting addresses details

      cy.get('#ya-myab-display-address-block-1 > .a-box-inner > .a-section > .a-spacing-small > .a-unordered-list > :nth-child(1) > .a-list-item > #address-ui-widgets-FullName')
        .should('have.text','Sanjana')

      cy.get('#ya-myab-display-address-block-1 > .a-box-inner > .a-section > .a-spacing-small > .a-unordered-list > :nth-child(2) > .a-list-item > #address-ui-widgets-AddressLineOne')
          .should('have.text','10-23/B')

      cy.get('#ya-myab-display-address-block-1 > .a-box-inner > .a-section > .a-spacing-small > .a-unordered-list > :nth-child(3) > .a-list-item > #address-ui-widgets-AddressLineTwo')
          .should('have.text','Narayanaguda')

      cy.get('#ya-myab-display-address-block-1 > .a-box-inner > .a-section > .a-spacing-small > .a-unordered-list > :nth-child(4) > .a-list-item > #address-ui-widgets-CityStatePostalCode')
        .should('have.text','HYDERABAD, TELANGANA 500029')

      cy.get('#ya-myab-display-address-block-1 > .a-box-inner > .a-section > .a-spacing-small > .a-unordered-list > :nth-child(5) > .a-list-item > #address-ui-widgets-Country')
        .should('have.text','India')

    })
})
