def test_discovery_test():
	from www.api.views import alchemy

	# (This isn't a meaningful alchemy request, just testing the service for now)
	alchemy.GetAlchemyRequest("hello", "world!")
