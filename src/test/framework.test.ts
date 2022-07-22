import chai from "chai";
import { Request } from "express";
import { config } from "process";
// import { config } from "process";
import { parseAttributes, parseBody, parseInclude, parseLimit, parseOffset, parseOrder, parseWhere, parseId } from "../library/utils";

import {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} from "sequelize-test-helpers";

import { Sequelize } from "sequelize-typescript";
import testDB from "../test/utils";
import { Thing } from "../models/Thing";

/*
TESTING API
*/

describe("Test framework app unit test", () => {
  before("Setup DB", async function() {
    this.timeout(50000);
    await testDB.init();
  });

  const request: Partial<Request> = {
    body: {
      address: "TestNoffftification@c.com",
      birthdate: "2020-08-01T15:01:11-05:00",
      appraisalBody: {
        grossSalary: 200,
        currencyId: 3,
      },
      benefitsPackageId: 1,
      departmentId: 10,
      emergencyContact: "TestNotification",
      emergencyNumber: "9999999999",
      extraBenefits: [],
      filesId: [],
      firstName: "TestAlex",
      hiringDate: "2022-02-09T15:01:00-06:00",
      isDepartmentManager: false,
      jobEmail: "t@test.com",
      personalEmail: "t@wASdfsfs.com",
      positionId: 1,
      lastName: "TestAlex",
      managerId: 448,
      middleName: "TestAlex",
      nationalIdentificationNumber: "TestNotification",
      phone: "9999999999",
      profileImageId: null,
      projects: [],
      regionId: 3,
      roleId: [2, 3],
      secondLastName: "TestAlex",
      socialSecurityNumber: "TestNotification",
      status: "active",
      taxIdentificationNumber: "TestNotification",
      terminationDate: "",
      workingHours: 8,
    },
    params: {
      id: "24",
    },
    query: {
      where: {
        lastName: "TestAlex",
      },
      limit: "2",
      order: {
        name: "1",
      },
      offset: "3",
      attributes: ["roleId", "status", "positionId", "extraBenefits"],
      include: [],
    },
  };

  describe("#parseBody()", function () {
    const parseBodyFunc = parseBody(request);
    it("should be destructure property body", function () {
      const { body } = request;
      chai.expect(parseBodyFunc).to.be.equal(body);
    });

    it("should be an object type", function () {
      chai.expect(parseBodyFunc).to.be.an("object");
    });
  });

  describe("#parseId", () => {
    const parseIdFunc = parseId(request);
    it("should be destructure id property", () => {
      chai.expect(parseIdFunc).to.be.equal(24);
    });

    it("should be a number type", () => {
      chai.expect(parseIdFunc).to.be.an("number");
    });
  });

  describe("#parseWhere", () => {
    const parseWhereFunc = parseWhere(request, request.percentEncode);
    it("should be destructure the property where", () => {
      chai.expect(parseWhereFunc).to.be.equal(request.query.where);
    });

    it("should be a object type", () => {
      chai.expect(parseWhereFunc).to.be.an("object");
    });
  });

  describe("#parseLimit", () => {
    const parseLimitFunc = parseLimit(request, config);
    it("should be destructure the property limit of 2", () => {
      chai.expect(parseLimitFunc).to.be.equal(Number(request.query.limit));
    });

    it("should be a number type", () => {
      chai.expect(parseLimitFunc).to.be.an("number");
    });
  });

  describe("#parseOffset", () => {
    const parseOffsetFunc = parseOffset(request, config);
    it("should be destructure the property limit of 3", () => {
      chai.expect(parseOffsetFunc).to.be.equal(Number(request.query.offset));
    });

    it("should be a number type", () => {
      chai.expect(parseOffsetFunc).to.be.an("number");
    });
  });

  describe("#parseOrder", () => {
    const parseOrderFunc = parseOrder(request);
    it("should be destructure the property order", () => {
      chai.expect(parseOrderFunc).to.be.equal(request.query.order);
    });

    it("should be a object type", () => {
      chai.expect(parseOrderFunc).to.be.an("object");
    });
  });

  describe("#parseAttributes", () => {
    const parseAttributesFunc = parseAttributes(request);
    it("should be destructure the property attributes", () => {
      chai
        .expect(parseAttributesFunc)
        .to.be.deep.equal(request.query.attributes);
    });

    it("should be a array type", () => {
      chai.expect(parseAttributesFunc).to.be.an("array");
    });
  });

  describe("#parseInclude", () => {
    // const parseAttributesFunc = parseInclude(request, myModel, db);
    const parseIncludeFunc = parseInclude(request, Thing, testDB.getDB);
    console.log("Include: ", parseIncludeFunc);
    
    
    // func();
    it("should be destructure the property include", () => {
      chai
        .expect(parseIncludeFunc)
        .to.be.deep.equal(request.query.include);
    });

    it("should be a array type", () => {
      chai.expect(parseIncludeFunc).to.be.an("array");
    });
  });

});