# core/services/pricing.py

def compute_quotation(order):
    BASE_RADIUS_KM = 15
    EXCESS_KM_RATE = 10
    DISTANCE_THRESHOLD_KM = 30
    CEMENT_BAG_PRICE = 250

    total = 0
    breakdown = []

    for item in order.designs.all():
        base = item.mix_design.price_per_cubic * item.volume
        distance_cost = 0
        long_distance = 0
        gov_cost = 0

        if order.distance_km > BASE_RADIUS_KM:
            distance_cost = (order.distance_km - BASE_RADIUS_KM) * EXCESS_KM_RATE * item.volume

        if order.distance_km > DISTANCE_THRESHOLD_KM:
            long_distance = CEMENT_BAG_PRICE * item.volume

        if order.project_type == "government":
            gov_cost = CEMENT_BAG_PRICE * item.volume

        subtotal = base + distance_cost + long_distance + gov_cost
        total += subtotal

        breakdown.append({
            "design": item.mix_design.design_name,
            "subtotal": subtotal
        })

    return total, breakdown