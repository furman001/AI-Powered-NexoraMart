from fastapi import APIRouter


from app.api.v1.routes import analytics
from app.api.v1.routes import auth
from app.api.v1.routes import categories
from app.api.v1.routes import catalog
from app.api.v1.routes import orders
from app.api.v1.routes import products
from app.api.v1.routes import questions
from app.api.v1.routes import reviews
from app.api.v1.routes import support
from app.api.v1.routes import uploads
from app.api.v1.routes import payments
from app.api.v1.routes import recommendations
from app.api.v1.routes import settings



api_router = APIRouter()



api_router.include_router(auth.router)
api_router.include_router(categories.router)
api_router.include_router(products.router)
api_router.include_router(uploads.router)
api_router.include_router(catalog.router)
api_router.include_router(orders.router)
api_router.include_router(analytics.router)
api_router.include_router(reviews.router)
api_router.include_router(questions.router)
api_router.include_router(support.router)
api_router.include_router(payments.router)
api_router.include_router(recommendations.router)
api_router.include_router(settings.router)
