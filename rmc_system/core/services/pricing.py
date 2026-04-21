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

from decimal import Decimal

def compute_quotation(order):
    BASE_RADIUS_KM = 15
    EXCESS_KM_RATE = 10
    CEMENT_SURCHARGE = 250
    
    total = Decimal('0.00')
    breakdown = []
    dist = Decimal(str(order.distance_km)) if order.distance_km else Decimal('0.00')

    for item in order.order_items.all():
        base = item.mix_design.price_per_cubic * item.volume
        delivery = (dist - BASE_RADIUS_KM) * Decimal(str(EXCESS_KM_RATE)) * item.volume if dist > BASE_RADIUS_KM else 0
        gov_fee = Decimal(str(CEMENT_SURCHARGE)) * item.volume if order.project_type == "Government" else 0
        
        subtotal = base + Decimal(delivery) + gov_fee
        total += subtotal
        breakdown.append({"mix": item.mix_design.design_name, "subtotal": float(subtotal)})

    return total, breakdown