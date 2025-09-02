---
title: Designing a Flash Sale
description: Flash sale is not a distributed transaction problem, it's a high throughput and contention problem
publishDate: "2025-09-02T13:01:37.612Z"
tags: ["system-design", "hld", "hld-concepts"]
---
## Designing a Flash Sale ?
![](img/flash-sale/assets_task_01k4543zwmf48smtxr2djx7fsx_1756813831_img_1.webp)

- Fixed Set of Items
- People come to buy them in short window

#### Why is it called Flash Sale ?
- Lot of people coming in a flash to purchase items.
- Flash sale is not a distributed transaction problem, it's a high throughput and contention problem.
- High Throughput  + Contention = LOCK

- We should not even allow more than n people to reach the payment page. (1st step)

**BRAINSTORM**
- Should payment be pre or post ?
	- If payment is post and 50k people add the item to cart and make payment we only have 10k items in inventory, then it will be a problem.


#### Phase 0 : Prepare the Stock
	- As a store owner, you stock the items in store.
	- Users come in they try to grab item and then add it to their cart.
		- Only N Should succeed. (HIGH THORUGHPUT + CONTENTION)
- Drawing parallels to real world
	- Shopkeeper planning flash sale ~= flash sale on website
	- small gate in shop ~= rate limiter
	- people grabbing the first item they see ~= exclusive lock
	- people adding phone to cart and not buying, shopkeeper hiring bouncers to keep the phone back in place ~= cron job


- These two queries should be fired in one transaction.
- FOR UPDATE makes item unavailable for others
```
SELECT * FROM units where item_id = 720 and picked_at is NULL order by id limit 1
FOR UPDATE SKIP LOCKED;

UPDATE units set picked_at=NOW(), picked_by=1023 where id = ?
```

**DB Schema**
![](img/flash-sale/Pasted%20image%2020250902181951.png)

#### Phase 2: Payment
- This is a different flow and has nothing do to with flash sale.
	- We CANNOT have a distributed transaction spanning - add to cart and payment.
- User Continues with the normal flow of payment and confirms the purchase.
- On Successfull payment
	- mark item set purchased_by=? and purchased_at=NOW()
	- create order, etc...
- On Unsuccessfull payment
	- make item re-availaible by setting
		- picked_at = NULL
		- picked_by = NULL

- For Payment we have a webhook call (stitched by payment_id), by which we will know that payment on respective order is success/failed.

#### What if no payment after adding to cart ?
- Run A CRON job that iterates through expired units and sets picked-at = NULL and picked-by=NULL

```
	UPDATE units set picked_at=NULL and picked_by=NULL 
	where picked_at < NOW() - 12 minutes
```

- Either we disappoint some customers or our company gets disappointed with under selling.

#### Similar Systems (Fixed Inventory + Contention)
- any ticket Booking site (BookMyShow)
- IRCTC
- Hotel Booking