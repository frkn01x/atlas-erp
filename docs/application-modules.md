# Arsivde uygulama olarak isaretlenen moduller

Manifestlerdeki application=True degerine gore olusturulmustur. Bu liste tum teknik modullerin yerine gecmez.

## Invoicing (account)

Invoices & Payments

- Kategori: Accounting/Accounting
- Bagimliliklar: base_setup, onboarding, product, analytic, portal, digest
- Model dosyasi: 57
- action_/button_ metodu: 85
- Yeni uygulama alanlari: invoices, journal
- Durum: core; tam esdegerlik: hayir

## Calendar (calendar)

Schedule employees

- Kategori: Productivity/Calendar
- Bagimliliklar: base, mail
- Model dosyasi: 19
- action_/button_ metodu: 11
- Yeni uygulama alanlari: calendar
- Durum: basic; tam esdegerlik: hayir

## Contacts (contacts)

Centralize your address book

- Kategori: Sales/CRM
- Bagimliliklar: base_address_extended, mail, web_hierarchy
- Model dosyasi: 3
- action_/button_ metodu: 0
- Yeni uygulama alanlari: contacts
- Durum: core; tam esdegerlik: hayir

## CRM (crm)

Track leads and close opportunities

- Kategori: Sales/CRM
- Bagimliliklar: base_setup, base_install_request, sales_team, mail, calendar, resource, utm, web_tour, contacts, digest, phone_validation
- Model dosyasi: 18
- action_/button_ metodu: 19
- Yeni uygulama alanlari: crm
- Durum: basic; tam esdegerlik: hayir

## Data Recycle (data_recycle)

Find old records and archive/delete them

- Kategori: Productivity/Data Cleaning
- Bagimliliklar: mail
- Model dosyasi: 3
- action_/button_ metodu: 4
- Yeni uygulama alanlari: dataRecycle
- Durum: basic; tam esdegerlik: hayir

## Fleet (fleet)

Manage your fleet and track car costs

- Kategori: Human Resources/Fleet
- Bagimliliklar: base, mail
- Model dosyasi: 15
- action_/button_ metodu: 13
- Yeni uygulama alanlari: fleet
- Durum: basic; tam esdegerlik: hayir

## Employees (hr)

Centralize employee information

- Kategori: Human Resources/Employees
- Bagimliliklar: auth_signup, base_setup, digest, phone_validation, resource_mail, web_hierarchy
- Model dosyasi: 30
- action_/button_ metodu: 28
- Yeni uygulama alanlari: employees
- Durum: basic; tam esdegerlik: hayir

## Attendances (hr_attendance)

Track employee attendance

- Kategori: Human Resources/Attendances
- Bagimliliklar: hr, hr_work_entry, barcodes, base_geolocalize
- Model dosyasi: 12
- action_/button_ metodu: 10
- Yeni uygulama alanlari: attendance
- Durum: basic; tam esdegerlik: hayir

## Expenses (hr_expense)

Submit, validate and reinvoice employee expenses

- Kategori: Human Resources/Expenses
- Bagimliliklar: account, web_tour, hr
- Model dosyasi: 18
- action_/button_ metodu: 16
- Yeni uygulama alanlari: expenses
- Durum: basic; tam esdegerlik: hayir

## Time Off (hr_holidays)

Allocate time off and follow leave requests

- Kategori: Human Resources/Time Off
- Bagimliliklar: hr_work_entry, hr_calendar, resource
- Model dosyasi: 25
- action_/button_ metodu: 21
- Yeni uygulama alanlari: leave
- Durum: basic; tam esdegerlik: hayir

## Recruitment (hr_recruitment)

Track your recruitment pipeline

- Kategori: Human Resources/Recruitment
- Bagimliliklar: hr, calendar, utm, attachment_indexation, web_tour, digest
- Model dosyasi: 25
- action_/button_ metodu: 15
- Yeni uygulama alanlari: recruitment
- Durum: basic; tam esdegerlik: hayir

## Skills Management (hr_skills)

Manage skills, knowledge and resume of your employees

- Kategori: Human Resources/Employees
- Bagimliliklar: hr
- Model dosyasi: 13
- action_/button_ metodu: 2
- Yeni uygulama alanlari: skills
- Durum: basic; tam esdegerlik: hayir

## Live Chat (im_livechat)

Chat with your website visitors

- Kategori: Website/Live Chat
- Bagimliliklar: mail, digest, utm, phone_validation
- Model dosyasi: 22
- action_/button_ metodu: 7
- Yeni uygulama alanlari: livechat
- Durum: basic; tam esdegerlik: hayir

## Lunch (lunch)

Handle lunch orders of your employees

- Kategori: Human Resources/Lunch
- Bagimliliklar: mail
- Model dosyasi: 13
- action_/button_ metodu: 11
- Yeni uygulama alanlari: lunch
- Durum: basic; tam esdegerlik: hayir

## Discuss (mail)

Chat, mail gateway and private channels

- Kategori: Productivity/Discuss
- Bagimliliklar: base, base_setup, bus, web_tour, html_editor
- Model dosyasi: 87
- action_/button_ metodu: 33
- Yeni uygulama alanlari: discuss
- Durum: basic; tam esdegerlik: hayir

## Maintenance (maintenance)

Track equipment and manage maintenance requests

- Kategori: Supply Chain/Maintenance
- Bagimliliklar: mail
- Model dosyasi: 3
- action_/button_ metodu: 0
- Yeni uygulama alanlari: maintenance
- Durum: basic; tam esdegerlik: hayir

## Marketing Card (marketing_card)

Generate dynamic shareable cards

- Kategori: Marketing/Marketing Card
- Bagimliliklar: link_tracker, mass_mailing, website, base_report_wkhtmltox
- Model dosyasi: 8
- action_/button_ metodu: 9
- Yeni uygulama alanlari: marketingCards
- Durum: basic; tam esdegerlik: hayir

## Email Marketing (mass_mailing)

Design, send and track emails

- Kategori: Marketing/Email Marketing
- Bagimliliklar: contacts, mail, html_builder, utm, link_tracker, social_media, web_tour, digest
- Model dosyasi: 26
- action_/button_ metodu: 53
- Yeni uygulama alanlari: emailMarketing
- Durum: basic; tam esdegerlik: hayir

## SMS Marketing (mass_mailing_sms)

Design, send and track SMS

- Kategori: Marketing/Email Marketing
- Bagimliliklar: portal, mass_mailing, sms
- Model dosyasi: 12
- action_/button_ metodu: 11
- Yeni uygulama alanlari: smsMarketing
- Durum: basic; tam esdegerlik: hayir

## Manufacturing (mrp)

Manufacturing Orders & BOMs

- Kategori: Supply Chain/Manufacturing
- Bagimliliklar: product, stock, resource
- Model dosyasi: 24
- action_/button_ metodu: 81
- Yeni uygulama alanlari: manufacturing
- Durum: core; tam esdegerlik: hayir

## Point of Sale (point_of_sale)

Handle checkouts and payments for shops and restaurants.

- Kategori: Sales/Point of Sale
- Bagimliliklar: resource, product, account, barcodes_gs1_nomenclature, html_editor, digest, phone_validation, google_address_autocomplete, base_report_wkhtmltox, iot_webserial
- Model dosyasi: 55
- action_/button_ metodu: 31
- Yeni uygulama alanlari: pos
- Durum: basic; tam esdegerlik: hayir

## Restaurant (pos_restaurant)

Restaurant extensions for the Point of Sale 

- Kategori: Sales/Point of Sale
- Bagimliliklar: point_of_sale
- Model dosyasi: 12
- action_/button_ metodu: 0
- Yeni uygulama alanlari: restaurant
- Durum: basic; tam esdegerlik: hayir

## Project (project)

Manage tasks and collaborate on projects

- Kategori: Services/Project
- Bagimliliklar: analytic, base_setup, mail, portal_rating, resource, web, web_tour, digest
- Model dosyasi: 23
- action_/button_ metodu: 37
- Yeni uygulama alanlari: projects, tasks
- Durum: basic; tam esdegerlik: hayir

## To-Do (project_todo)

Organize your work with memos and to-do lists

- Kategori: Productivity/To-Do
- Bagimliliklar: project
- Model dosyasi: 3
- action_/button_ metodu: 1
- Yeni uygulama alanlari: todo
- Durum: basic; tam esdegerlik: hayir

## Purchase (purchase)

Purchase orders, tenders and agreements

- Kategori: Supply Chain/Purchase
- Bagimliliklar: account
- Model dosyasi: 15
- action_/button_ metodu: 29
- Yeni uygulama alanlari: purchases
- Durum: core; tam esdegerlik: hayir

## Repairs (repair)

Repair damaged products

- Kategori: Supply Chain/Inventory
- Bagimliliklar: sale_stock, sale_management
- Model dosyasi: 13
- action_/button_ metodu: 22
- Yeni uygulama alanlari: repairs
- Durum: basic; tam esdegerlik: hayir

## Sales (sale_management)

From quotations to invoices

- Kategori: Sales/Sales
- Bagimliliklar: sale, digest
- Model dosyasi: 7
- action_/button_ metodu: 3
- Yeni uygulama alanlari: sales
- Durum: core; tam esdegerlik: hayir

## Inventory (stock)

Manage your stock and logistics activities

- Kategori: Supply Chain/Inventory
- Bagimliliklar: product, barcodes_gs1_nomenclature, digest
- Model dosyasi: 29
- action_/button_ metodu: 99
- Yeni uygulama alanlari: inventory
- Durum: core; tam esdegerlik: hayir

## Surveys (survey)

Send your surveys or share them live.

- Kategori: Marketing/Surveys
- Bagimliliklar: auth_signup, http_routing, mail, web_tour, gamification, digest
- Model dosyasi: 12
- action_/button_ metodu: 21
- Yeni uygulama alanlari: surveys
- Durum: basic; tam esdegerlik: hayir

## Website (website)

Enterprise website builder

- Kategori: Website/Website
- Bagimliliklar: digest, web, html_editor, http_routing, portal, social_media, auth_signup, mail, google_recaptcha, utm, html_builder
- Model dosyasi: 38
- action_/button_ metodu: 15
- Yeni uygulama alanlari: website
- Durum: basic; tam esdegerlik: hayir

## Events (website_event)

Publish events, sell tickets

- Kategori: Marketing/Events
- Bagimliliklar: event, website, website_partner, website_mail, html_builder
- Model dosyasi: 13
- action_/button_ metodu: 0
- Yeni uygulama alanlari: events
- Durum: basic; tam esdegerlik: hayir

## Online Jobs (website_hr_recruitment)

Manage your online hiring process

- Kategori: Website/Website
- Bagimliliklar: hr_recruitment, website_mail
- Model dosyasi: 7
- action_/button_ metodu: 1
- Yeni uygulama alanlari: jobs
- Durum: basic; tam esdegerlik: hayir

## eCommerce (website_sale)

Sell your products online

- Kategori: Website/Website
- Bagimliliklar: website, sale, website_payment, website_mail, portal_rating, digest, delivery, html_builder
- Model dosyasi: 42
- action_/button_ metodu: 9
- Yeni uygulama alanlari: ecommerce
- Durum: basic; tam esdegerlik: hayir

## eLearning (website_slides)

Manage and publish an eLearning platform

- Kategori: Website/eLearning
- Bagimliliklar: portal_rating, website, website_mail, website_profile, digest
- Model dosyasi: 23
- action_/button_ metodu: 20
- Yeni uygulama alanlari: courses
- Durum: basic; tam esdegerlik: hayir
