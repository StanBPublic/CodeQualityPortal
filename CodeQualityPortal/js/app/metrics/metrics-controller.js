﻿'use strict';

metricsModule.controller("MetricsController", function ($scope, bootstrappedData, $log, metricsService) {    
    $scope.criteria = {}; // shared with child controllers       
    $scope.mode = {}; // shared with child controllers       
                        
    $scope.init = function () {
        $scope.mode = new $scope.tagMode;
        $scope.refreshChart();
    }

    
    // Can't set mode from child scope without this
    $scope.setMode = function (mode) {
        $scope.mode = mode;    
    };

    $scope.refreshChart = function () {
        $scope.mode.getTrend()
            .$promise.then(
                function(data) {
                    $scope.criteria.selectedDate = null;
                    $scope.items = [];
                    $scope.$broadcast("adjust_chart");
                    $scope.trendData = data;
                },
                function (error) {
                    $log.error(error);
                });
    }

    $scope.refreshGrid = function () {
        // Can't bind directly to items since wijmo doesn't like promise
        $scope.mode.getItems()        
            .$promise.then(
                function (data) {
                    $scope.items = data;
                }
        );
    }

    // 1 - tag
    $scope.tagMode = function () {
        return {
            getTrend: function () {
                return metricsService.getTagTrend($scope.criteria.tag, $scope.criteria.dateFrom, $scope.criteria.dateTo);
            },
            getItems: function () {
                return metricsService.getModulesByDate($scope.criteria.tag, $scope.criteria.selectedDate.dateId);
            },
            trendLabel: "Tag trend for " + $scope.criteria.tag,
            itemsLabel: "Modules on"
        };
    };

    // 2 - module
    $scope.moduleMode = function () {
        return {
            getTrend: function () {
                return metricsService.getNamespaceTrend($scope.criteria.module.id, $scope.criteria.dateFrom, $scope.criteria.dateTo);
            },
            getItems: function () {
                return metricsService.getNamespacesByDate($scope.criteria.module.id, $scope.criteria.selectedDate.dateId);
            },
            trendLabel: "Module trend for " + $scope.criteria.module.name,
            itemsLabel: "Namespaces on "
        };
    };

    // 3 - namespace
    $scope.namespaceMode = function () {
        return {
            getTrend: function () {
                return metricsService.getTypeTrend($scope.criteria.namespace.id, $scope.criteria.dateFrom, $scope.criteria.dateTo);
            },
            getItems: function () {
                return metricsService.getTypesByDate($scope.criteria.namespace.id, $scope.criteria.selectedDate.dateId);
            },
            trendLabel: "Namespace trend for " + $scope.criteria.namespace.name,
            itemsLabel: "Types on "
        };
    };

    // 4 - type
    $scope.typeMode = function () {
        return {
            getTrend: function () {
                return metricsService.getMemberTrend($scope.criteria.type.id, $scope.criteria.dateFrom, $scope.criteria.dateTo);
            },
            getItems: function () {
                return metricsService.getMembersByDate($scope.criteria.type.id, $scope.criteria.selectedDate.dateId);
            },
            trendLabel: "Type trend for " + $scope.criteria.type.name,
            itemsLabel: "Members on "
        };
    };
});

