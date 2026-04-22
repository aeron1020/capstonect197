# # core/services/pricing.py

# def compute_quotation(order):
#     BASE_RADIUS_KM = 15
#     EXCESS_KM_RATE = 10
#     DISTANCE_THRESHOLD_KM = 30
#     CEMENT_BAG_PRICE = 250

#     total = 0
#     breakdown = []

#     for item in order.designs.all():
#         base = item.mix_design.price_per_cubic * item.volume
#         distance_cost = 0
#         long_distance = 0
#         gov_cost = 0

#         if order.distance_km > BASE_RADIUS_KM:
#             distance_cost = (order.distance_km - BASE_RADIUS_KM) * EXCESS_KM_RATE * item.volume

#         if order.distance_km > DISTANCE_THRESHOLD_KM:
#             long_distance = CEMENT_BAG_PRICE * item.volume

#         if order.project_type == "government":
#             gov_cost = CEMENT_BAG_PRICE * item.volume

#         subtotal = base + distance_cost + long_distance + gov_cost
#         total += subtotal

#         breakdown.append({
#             "design": item.mix_design.design_name,
#             "subtotal": subtotal
#         })

#     return total, breakdown

# from decimal import Decimal

# def compute_quotation(order):
#     BASE_RADIUS_KM = 15
#     EXCESS_KM_RATE = 10
#     CEMENT_SURCHARGE = 250
    
#     total = Decimal('0.00')
#     breakdown = []
#     dist = Decimal(str(order.distance_km)) if order.distance_km else Decimal('0.00')

#     for item in order.order_items.all():
#         base = item.mix_design.price_per_cubic * item.volume
#         delivery = (dist - BASE_RADIUS_KM) * Decimal(str(EXCESS_KM_RATE)) * item.volume if dist > BASE_RADIUS_KM else 0
#         gov_fee = Decimal(str(CEMENT_SURCHARGE)) * item.volume if order.project_type == "Government" else 0
        
#         subtotal = base + Decimal(delivery) + gov_fee
#         total += subtotal
#         breakdown.append({"mix": item.mix_design.design_name, "subtotal": float(subtotal)})

#     return total, breakdown

# from decimal import Decimal

# def compute_quotation(order):
#     BASE_RADIUS_KM = 15
#     EXCESS_KM_RATE = 10
#     CEMENT_SURCHARGE = 250
    
#     total = Decimal('0.00')
#     # Changed from a list [] to a dictionary {}
#     items_breakdown = {} 
#     dist = Decimal(str(order.distance_km)) if order.distance_km else Decimal('0.00')
    
#     # Calculate delivery fee once (Total for the whole order)
#     # If you want it per item, keep it inside the loop, but usually it's a flat rate per project
#     delivery_fee_total = Decimal('0.00')
#     if dist > BASE_RADIUS_KM:
#         # Distance surcharge calculation
#         delivery_fee_total = (dist - BASE_RADIUS_KM) * Decimal(str(EXCESS_KM_RATE))

#     for item in order.order_items.all():
#         unit_price = item.mix_design.price_per_cubic
#         base_subtotal = unit_price * item.volume
        
#         # Government surcharge logic
#         gov_fee = Decimal(str(CEMENT_SURCHARGE)) * item.volume if order.project_type == "Government" else 0
        
#         # Calculation for this specific item
#         item_subtotal = base_subtotal + gov_fee
#         total += item_subtotal
        
#         # Save detailed data for the frontend table
#         items_breakdown[item.mix_design.design_name] = {
#             "unit_price": float(unit_price),
#             "volume": float(item.volume),
#             "subtotal": float(item_subtotal)
#         }

#     # Add the delivery fee to the final grand total
#     total += delivery_fee_total

#     # Final structure for JSONField
#     final_breakdown = {
#         "items": items_breakdown,
#         "delivery_fee": float(delivery_fee_total)
#     }

#     return total, final_breakdown

# from decimal import Decimal

# def compute_quotation(order, pump_rental=0, pump_mobilization=0, discount=0, payment_terms="Cash on Delivery"):
#     BASE_RADIUS_KM = 15
#     EXCESS_KM_RATE = 10
#     CEMENT_SURCHARGE = 250
    
#     total = Decimal('0.00')
#     items_breakdown = {} 
    
#     # 1. Use the distance passed from the Admin Editor (or fall back to order default)
#     dist = Decimal(str(order.distance_km)) if order.distance_km else Decimal('0.00')
    
#     # 2. Calculate Delivery Fee
#     delivery_fee_total = Decimal('0.00')
#     if dist > BASE_RADIUS_KM:
#         delivery_fee_total = (dist - BASE_RADIUS_KM) * Decimal(str(EXCESS_KM_RATE))

#     # 3. Calculate Concrete Items
#     for item in order.order_items.all():
#         unit_price = item.mix_design.price_per_cubic
#         base_subtotal = unit_price * item.volume
        
#         # Government surcharge logic
#         gov_fee = Decimal(str(CEMENT_SURCHARGE)) * item.volume if order.project_type == "Government" else Decimal('0.00')
        
#         item_subtotal = base_subtotal + gov_fee
#         total += item_subtotal
        
#         items_breakdown[item.mix_design.design_name] = {
#             "unit_price": float(unit_price),
#             "volume": float(item.volume),
#             "subtotal": float(item_subtotal)
#         }

#     # 4. Add Extra Charges from Admin Editor
#     p_rental = Decimal(str(pump_rental))
#     p_mob = Decimal(str(pump_mobilization))
#     disc = Decimal(str(discount))

#     # Calculate final grand total
#     # Total = Concrete + Delivery + Pump Rental + Pump Mobilization - Discount
#     total = total + delivery_fee_total + p_rental + p_mob - disc

#     # 5. Final structure for JSONField (Ensuring all keys exist for the frontend)
#     final_breakdown = {
#         "items": items_breakdown,
#         "delivery_fee": float(delivery_fee_total),
#         "pump_rental": float(p_rental),
#         "pump_mobilization": float(p_mob),
#         "discount": float(disc),
#         "payment_terms": payment_terms,
#         "total_amount": float(total)
#     }

#     return total, final_breakdown

from decimal import Decimal

def compute_quotation(order, pump_rental=0, pump_mobilization=0, discount=0, payment_terms="Cash on Delivery"):
    BASE_RADIUS_KM = 15
    EXCESS_KM_RATE = 10 # This is now treated as "Pesos per Cubic per Excess KM"
    CEMENT_SURCHARGE = 250
    
    total = Decimal('0.00')
    items_breakdown = {} 
    
    # 1. Calculate the Distance Surcharge per Cubic Meter
    dist = Decimal(str(order.distance_km or 0))
    distance_surcharge_per_m3 = Decimal('0.00')
    
    if dist > BASE_RADIUS_KM:
        # Example: 20km - 15km = 5 excess km. 5km * 10 pesos = 50 pesos extra per m3.
        distance_surcharge_per_m3 = (dist - BASE_RADIUS_KM) * Decimal(str(EXCESS_KM_RATE))

    # 2. Calculate Concrete Items
    for item in order.order_items.all():
        base_unit_price = Decimal(str(item.mix_design.price_per_cubic))
        
        # Add the distance surcharge and government surcharge (if any) to the unit price
        gov_fee = Decimal(str(CEMENT_SURCHARGE)) if order.project_type == "Government" else Decimal('0.00')
        
        # NEW FINAL UNIT PRICE (Base + Distance Surcharge + Gov Fee)
        final_unit_price = base_unit_price + distance_surcharge_per_m3 + gov_fee
        
        item_subtotal = final_unit_price * item.volume
        total += item_subtotal
        
        items_breakdown[item.mix_design.design_name] = {
            "unit_price": float(final_unit_price), # This now includes the delivery cost
            "volume": float(item.volume),
            "subtotal": float(item_subtotal)
        }

    # 3. Add Extra Equipment Charges
    p_rental = Decimal(str(pump_rental))
    p_mob = Decimal(str(pump_mobilization))
    disc = Decimal(str(discount))

    # Total = (Concrete with distance included) + Pump - Discount
    total = total + p_rental + p_mob - disc

    # 4. Final structure (Delivery Fee is now 0 as it's built into the items)
    final_breakdown = {
        "items": items_breakdown,
        "delivery_fee": 0.00, 
        "pump_rental": float(p_rental),
        "pump_mobilization": float(p_mob),
        "discount": float(disc),
        "payment_terms": payment_terms,
        "total_amount": float(total)
    }

    return total, final_breakdown