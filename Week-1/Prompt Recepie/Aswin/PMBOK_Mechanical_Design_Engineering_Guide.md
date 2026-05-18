
# PMBOK for Mechanical Design Projects + Real Engineering Examples

## Reusable Master Prompt

Act as a senior Engineering Program Manager with 20 years of experience in mechanical product development and PMP best practices.

Teach me how to apply PMBOK principles in mechanical design projects such as:
- Machine design
- Product development
- Tooling
- Automation systems
- Medical devices

Explain:
- Key PMBOK knowledge areas
- Real engineering workflows
- Stakeholder responsibilities
- Risks and blockers
- Milestones and timelines
- Change management
- Verification and validation
- Manufacturing transfer

For every topic, include:
1. PMBOK principle
2. Mechanical engineering application
3. Common engineering mistake
4. Real engineering example
5. Senior Engineering PM lesson

Use practical, industry-style examples and explain like a mentor teaching a mechanical engineer to become an Engineering Program Manager.

---

# PMBOK Applied to Mechanical Design Projects

## Introduction

PMBOK is not extra paperwork for engineering. In mechanical design, PMBOK is the system that prevents:
- Late design changes
- Missed tolerances
- Supplier delays
- Test failures
- Compliance issues
- Cost overruns

Engineering builds the product.

PMBOK controls uncertainty while building the product.

## Example Project:
### Automated Bottle Capping Machine

**Business Goal**
Increase production output by 35%, reduce defects to <1%, and improve consistency.

### 1. Initiating

Create a project charter.

Example objective:

Design and implement an automated bottle capping system capable of:
- 40 bottles/min
- Torque consistency ±5%
- Reject rate <1%
- Existing conveyor integration
- Completion in 20 weeks

**Real Engineering Example**
A team assumed conveyor speed was fixed. Production later changed the line speed, forcing redesign.

**PM Lesson**
Validate assumptions early.

### 2. Planning

#### Requirements

Bad requirement:
“Machine should cap bottles fast.”

Good requirement:
- Cycle time ≤1.5 sec/bottle
- Bottle size 250–1000 ml
- Torque 18 ± 2 N·cm
- Changeover <15 min

**Real Engineering Example**
QA later requested torque traceability. Machine redesign added sensors and data logging.

**Lesson**
Engage stakeholders early.

#### Work Breakdown Structure (WBS)

Break into:
- Mechanical Design
- Controls
- Procurement
- Manufacturing
- Validation

**Real Engineering Example**
Guarding design was forgotten and delayed FAT.

**Lesson**
If it isn’t in WBS, it gets forgotten.

#### Schedule Planning

Typical milestones:
1. Requirements Freeze
2. Concept Design
3. CAD Completion
4. Procurement
5. Fabrication
6. Testing
7. FAT
8. Deployment

**Real Engineering Example**
Servo motor lead time was 8 weeks. Procurement started too late.

**Lesson**
Identify long lead items early.

### 3. Risk Management

Example risk register:

| Risk | Probability | Impact | Mitigation |
|---|---:|---:|---|
| Cap slippage | Medium | High | Prototype testing |
| Motor overheating | Medium | High | Thermal analysis |
| Pneumatic delay | High | Medium | Secondary supplier |

**Real Engineering Example**
Prototype vibration caused cap misalignment. Engineers added damping and guides.

**Lesson**
Anticipated problems are cheaper than surprises.

### 4. Execution

Conduct:
- Concept Review
- Preliminary Design Review (PDR)
- Critical Design Review (CDR)

**Real Engineering Example**
Manufacturing identified unmachinable geometry during CDR.

**Lesson**
Cross-functional reviews prevent downstream failures.

### 5. Change Control

Scenario:
Production requests square bottle compatibility.

Impact:
- Fixture redesign
- Validation updates
- Schedule slip
- Cost increase

Use Engineering Change Request (ECR).

Evaluate:
1. Cost impact
2. Schedule impact
3. Technical risk
4. Testing impact

**Lesson**
Small changes are rarely small.

### 6. Monitoring & Controlling

Track:
- CAD completion
- Budget usage
- Prototype pass rate
- Open risks

**Real Engineering Example**
CAD delays traced to overloaded engineer. Work redistributed.

**Lesson**
Track leading indicators.

### 7. Quality Management

Verification testing:
- Torque repeatability
- Cycle life
- Noise
- Vibration
- Safety interlocks

**Real Engineering Example**
Bearing failed after 50,000 cycles. Design corrected before release.

**Lesson**
Prototype success ≠ production success.

### 8. Medical Device Example

Reusable surgical handle.

Requirement:
500 sterilization cycles.

Problem:
ABS plastic degraded during autoclaving.

Fix:
Switch to medical-grade polymer before tooling.

**Lesson**
Technically correct does not always mean regulatory-ready.

## Senior Engineering Program Manager Mindset

Before Design:
- Did we define requirements correctly?

During Design:
- What can fail later?

Before Prototype:
- What assumptions remain untested?

Before Release:
- Are we ready for manufacturing?

That is PMBOK applied to real mechanical engineering.
