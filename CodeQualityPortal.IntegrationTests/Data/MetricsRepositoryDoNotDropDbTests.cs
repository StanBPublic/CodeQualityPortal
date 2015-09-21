﻿using CodeQualityPortal.Data;
using Dapper;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeQualityPortal.IntegrationTests.Data
{
    public class MetricsRepositoryDoNotDropDbTests
    {
        IMetricsRepository _repository;
        private IDbConnection _db;

        [TestFixtureSetUp]
        public void Setup()
        {
            AutoMapperConfig.CreateMaps();
            _repository = new MetricsRepository();
            _db = new SqlConnection(ConfigurationManager.ConnectionStrings["CodeQuality"].ConnectionString);
        }

        [TestFixtureTearDown]
        public void TearDown()
        {
            _repository.Dispose();
            _db.Close();
        }

        [Test]
        public void MetricRepository_GetSystemsByDate()
        {
            // Arrange
            // On which date there are most system data?
            var sql = @"select top 1 i.DateId, count(*) as SystemsCount from (
                        select fm.DateId, ds.Name
                        from DimSystem ds
                        join DimSystemModule dsm on dsm.SystemId = ds.SystemId
                        join DimModule dm on dm.ModuleId = dsm.ModuleId
                        join FactMetrics fm on fm.ModuleId = dm.ModuleId
                        group by fm.DateId, ds.Name ) as i
                        group by i.DateId
                        order by count(*)";
            var date = _db.Query<dynamic>(sql).SingleOrDefault();
            if (date == null)
            {
                Assert.Inconclusive("No data");
            }
            int dateId = date.DateId;
            int systemsCount = date.SystemsCount;

            // Act
            var items = _repository.GetSystemsByDate(dateId);

            // Assert
            Assert.That(items.Count, Is.EqualTo(systemsCount));
        }

        [Test]
        public void MetricsRepository_GetDatePoints()
        {
            var items = _repository.GetDatePoints();
            Assert.IsNotEmpty(items);
        }
    }
}