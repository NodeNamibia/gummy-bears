'use strict'

exports.EventRequestHandler = class EventRequestHandler
    _erhInstance = undefined

    @getRequestHandler: ->
        _erhInstance ?= new _LocalEventRequestHandler

    class _LocalEventRequestHandler

        _getAllEvents = (queueManager, poolManager, request, response) ->
            poolManager.acquire 'events', (controllerInstanceError, controllerInstance) =>
                if controllerInstanceError?
                    response.json 500, {error: controllerInstanceError.message}
                else if not controllerInstance?
                    getAllEventsRequestObject =
                        methodName: 'getAllEvents'
                        arguments: [queueManager, poolManager, request, response]
                    queueManager.enqueueRequest 'events', getAllEventsRequestObject
                else
                    controllerInstance.getAllEvents poolManager, queueManager, (allEventError, allEvents) =>
                        if allEventError?
                            response.json 500, {error: allEventError.message}
                        else
                            response.json 200, allEvents

        _getTimeFilteredEvents = (queueManager, poolManager, request, response) ->
            poolManager.acquire 'events', (controllerInstanceError, controllerInstance) =>
                if controllerInstanceError?
                    response.json 500, {error: controllerInstanceError.message}
                else if not controllerInstance?
                    getAllEventsRequestObject =
                        methodName: 'getTimeFilteredEvents'
                        arguments: [queueManager, poolManager, request, response]
                    queueManager.enqueueRequest 'events', getAllEventsRequestObject
                else
                    controllerInstance.getTimeFilteredEvents request.session?.student?.studentNumber, poolManager, queueManager, (getTimeFilteredEventsError, timeFilteredEvents) =>
                        if getTimeFilteredEventsError?
                            response.json 500, {error: getTimeFilteredEventsError.message}
                        else
                            response.json 200, {timeFilteredEvents}

        _insertAllEvents = (queueManager, poolManager, request, response) ->
            poolManager.acquire 'events', (controllerInstanceError, controllerInstance) =>
                if controllerInstanceError?
                    response.json 500, {error: controllerInstanceError.message}
                else if not controllerInstance?
                    insertAllEventsRequestObject =
                        methodName: 'insertAllEvents'
                        arguments: [queueManager, poolManager, request, response]
                    queueManager.enqueueRequest 'events', insertAllEventsRequestObject
                else
                    controllerInstance.insertAllEvents request.session?.user?.username, poolManager, queueManager, (eventCreationError, eventCreationResult) =>
                        if eventCreationError?
                            response.json 500, {error: eventCreationError.message}
                        else
                            response.json 201, eventCreationResult

        constructor: ->

        insertAllEvents: (queueManager, poolManager, request, response) =>
            _insertAllEvents.call @, queueManager, poolManager, request, response

        getTimeFilteredEvents: (queueManager, poolManager, request, response) =>
            _getTimeFilteredEvents.call @, queueManager, poolManager, request, response

        getAllEvents: (queueManager, poolManager, request, response) =>
            _getAllEvents.call @, queueManager, poolManager, request, response
