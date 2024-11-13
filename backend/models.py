from enum import Enum
from typing import List, Union, Optional, Literal
from uuid import UUID

from pydantic import BaseModel, Field


class Product(BaseModel):
    product_id: str
    name: str
    description: str
    category: str
    subcategory: str
    collection: str
    price: float
    image: str
    rating: float
    brand: str
    tags: Union[str, List[str]]
    reviews: Union[str, List[str]]
    colors: Union[str, List[str]]


class ResponseProduct(Product):
    score: Optional[float] = None


class SearchType(Enum):
    KEYWORD = "KEYWORD"
    VECTOR = "VECTOR"
    HYBRID = "HYBRID"
    IMAGE_HYBRID = "IMAGE_HYBRID"


class FacetItemStatus(Enum):
    CLICKED = "CLICKED"
    CLICKABLE = "CLICKABLE"
    DISABLED = "DISABLED"


class FacetType(Enum):
    SINGLE = "SINGLE"
    MULTI = "MULTI"
    RANGE = "RANGE"
    CATEGORY = "CATEGORY"
    COLLECTION = "COLLECTION"


class Filter(BaseModel):
    name: str


class TermFilter(Filter):
    value: str


class TermsFilter(Filter):
    values: List[str]


class RangeFilter(Filter):
    gte: float
    lte: float


class SortField(Enum):
    RELEVANCE = "RELEVANCE"
    POPULARITY = "POPULARITY"
    NAME = "NAME"
    PRICE = "PRICE"


class SortOrder(Enum):
    DESC = "DESC"
    ASC = "ASC"


class Sort(BaseModel):
    name: SortField
    order: SortOrder


class SearchRequest(BaseModel):
    query: Optional[str] = None
    type: SearchType = SearchType.HYBRID
    session_id: UUID
    size: int = 25
    page: int = 1
    filters: List[Union[TermFilter, TermsFilter, RangeFilter]] = Field(
        default_factory=list
    )
    sort: Optional[Sort] = None


class RecommendRequest(BaseModel):
    product_id: UUID
    session_id: UUID
    size: int = 3
    page: int = 1


class FacetItemValue(BaseModel):
    name: str
    hits: Optional[int] = None
    status: Optional[FacetItemStatus] = None


class Facet(BaseModel):
    name: str
    type: FacetType


class TermFacet(Facet):
    type: Literal[FacetType.SINGLE] = Field(default=FacetType.SINGLE)
    values: List[FacetItemValue]


class TermsFacet(Facet):
    type: Literal[FacetType.MULTI] = Field(default=FacetType.MULTI)
    values: List[FacetItemValue]


class CategoryFacet(Facet):
    type: Literal[FacetType.CATEGORY] = Field(default=FacetType.CATEGORY)
    values: List[FacetItemValue]


class CollectionFacet(Facet):
    type: Literal[FacetType.COLLECTION] = Field(default=FacetType.COLLECTION)
    values: List[FacetItemValue]


class RangeFacet(Facet):
    type: Literal[FacetType.RANGE] = Field(default=FacetType.RANGE)
    lower: Optional[float] = None
    upper: Optional[float] = None
    selected_lower: Optional[float] = None
    selected_upper: Optional[float] = None


class SearchResponse(BaseModel):
    query: Optional[str]
    session_id: UUID
    total_hits: int
    took: int
    hits: List[ResponseProduct]
    facets: List[
        Union[CategoryFacet, CollectionFacet, TermFacet, TermsFacet, RangeFacet]
    ]


class RecommendResponse(BaseModel):
    session_id: UUID
    took: int
    hits: List[ResponseProduct]
