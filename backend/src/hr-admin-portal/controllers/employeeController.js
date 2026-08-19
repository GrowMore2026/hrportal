const supabase = require('../../config/supabaseClient');

exports.createEmployee = async (req, res) => {
  try {
    const {
      emp_code, first_name, middle_name, last_name, title, dob, aadhaar_number, gender, blood_group, marital_status, nationality, profile_image,
      father_name, spouse_name, status, doj, probation_period, confirmation_date, notice_period, current_experience_in_year, total_experience,
      email, mobile, division, cost_center, grade, designation, location, department, shift, reporting_to,
      prev_organization, prev_designation, prev_location, prev_from_date, prev_to_date,
      present_name, present_address, present_city, present_country, present_pincode, present_phone,
      permanent_name, permanent_address, permanent_city, permanent_country, permanent_pincode, permanent_phone,
      emergency_name, emergency_relationship, emergency_address, emergency_country, emergency_pincode, emergency_phone,
      pan_number, include_pf, include_esi, include_lwf, pf_number, uan_number, pf_excess_contribution, payment_type
    } = req.body;

    // Insert into Supabase 'employees' table
    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          emp_code, first_name, middle_name, last_name, title, dob, aadhaar_number, gender, blood_group, marital_status, nationality, profile_image,
          father_name, spouse_name, status, doj, probation_period, confirmation_date, notice_period, current_experience_in_year, total_experience,
          email, mobile, division, cost_center, grade, designation, location, department, shift, reporting_to,
          prev_organization, prev_designation, prev_location, prev_from_date, prev_to_date,
          present_name, present_address, present_city, present_country, present_pincode, present_phone,
          permanent_name, permanent_address, permanent_city, permanent_country, permanent_pincode, permanent_phone,
          emergency_name, emergency_relationship, emergency_address, emergency_country, emergency_pincode, emergency_phone,
          pan_number, include_pf, include_esi, include_lwf, pf_number, uan_number, pf_excess_contribution, payment_type
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting employee:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Employee created successfully',
      employee: data[0]
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.searchEmployees = async (req, res) => {
  try {
    const { query, status } = req.query;
    
    let dbQuery = supabase.from('employees').select('*').order('created_at', { ascending: false });
    
    if (status && status !== 'All') {
      dbQuery = dbQuery.eq('status', status);
    }
    
    if (query) {
      dbQuery = dbQuery.or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,emp_code.ilike.%${query}%`);
    }

    const { data, error } = await dbQuery;

    if (error) {
      console.error('Error searching employees:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const { data, error } = await supabase.from('employees').select('*');

    if (error) {
      console.error('Error fetching all employees:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ employees: data });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    // Prevent updating immutable fields
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;
    
    // Remove frontend-only synthesized fields
    delete updateData.name;

    // Parse date fields from DD-MM-YYYY if necessary
    const parseDate = (val) => {
      if (!val || typeof val !== 'string') return val;
      const trimmed = val.trim();
      const parts = trimmed.includes('-') ? trimmed.split('-') : trimmed.split('/');
      if (parts.length === 3 && /^\d{1,2}$/.test(parts[0]) && /^\d{1,2}$/.test(parts[1]) && /^\d{4}$/.test(parts[2])) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return trimmed;
    };

    // Convert empty strings to null for database type constraints (e.g., date fields)
    for (const key in updateData) {
      if (updateData[key] === '') {
        updateData[key] = null;
      } else if (typeof updateData[key] === 'string') {
        updateData[key] = parseDate(updateData[key]);
      }
    }

    const { data, error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating employee:', error);
      console.log('Update Data being sent:', JSON.stringify(updateData).substring(0, 500) + '...');
      if (error.code === '22001') {
        // Find which field is too long
        let longFields = [];
        for (const key in updateData) {
          const val = updateData[key];
          const valStr = typeof val === 'string' ? val : JSON.stringify(val);
          if (valStr && valStr.length > 255) {
            longFields.push(`${key} (length: ${valStr.length})`);
          }
        }
        if (longFields.length > 0) {
          return res.status(400).json({ 
            error: `The following fields exceed 255 characters: ${longFields.join(', ')}.` 
          });
        } else {
          console.error("22001 error but NO fields > 255 chars in JS. Update keys:", Object.keys(updateData));
        }
      }
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.status(200).json({
      message: 'Employee updated successfully',
      employee: data[0]
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.bulkCreateEmployees = async (req, res) => {
  try {
    const { employees } = req.body;
    
    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ error: 'No valid employees array provided' });
    }

    const parseDate = (val) => {
      if (!val || typeof val !== 'string') return val;
      const trimmed = val.trim();
      const parts = trimmed.includes('-') ? trimmed.split('-') : trimmed.split('/');
      if (parts.length === 3) {
        if (/^\d{1,2}$/.test(parts[0]) && /^\d{1,2}$/.test(parts[1]) && /^\d{4}$/.test(parts[2])) {
          const day = parts[0].padStart(2, '0');
          const month = parts[1].padStart(2, '0');
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
      }
      return trimmed;
    };

    // Convert empty strings to null for database constraints and parse dates
    const cleanedEmployees = employees.map(emp => {
      let cleaned = {};
      for (const key in emp) {
        const lowerKey = key.toLowerCase().trim();
        let val = emp[key];
        
        if (val === '') {
          cleaned[lowerKey] = null;
        } else {
          cleaned[lowerKey] = parseDate(val);
        }
      }
      return cleaned;
    });

    const { data, error } = await supabase
      .from('employees')
      .upsert(cleanedEmployees, { onConflict: 'emp_code' })
      .select();

    if (error) {
      console.error('Error inserting bulk employees:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      message: `${data.length} employees created successfully`,
      employees: data
    });

  } catch (err) {
    console.error('Server error in bulkCreateEmployees:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching employee by id:', error);
      return res.status(404).json({ error: 'Employee not found' });
    }

    return res.status(200).json({ employee: data });
  } catch (err) {
    console.error('Server error in getEmployeeById:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
// ==========================================
// FAMILY DETAILS CONTROLLERS
// ==========================================

exports.getEmployeeFamily = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('employee_family_details')
      .select('*')
      .eq('employee_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching family details:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ family: data });
  } catch (err) {
    console.error('Server error in getEmployeeFamily:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addEmployeeFamily = async (req, res) => {
  try {
    const { id } = req.params;
    const familyData = { ...req.body, employee_id: id };
    
    // Clean up empty strings that can cause DB type errors
    if (familyData.dob === '') {
      familyData.dob = null;
    }

    const { data, error } = await supabase
      .from('employee_family_details')
      .insert([familyData])
      .select();

    if (error) {
      console.error('Error adding family details:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Family member added successfully', family: data[0] });
  } catch (err) {
    console.error('Server error in addEmployeeFamily:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateEmployeeFamily = async (req, res) => {
  try {
    const { familyId } = req.params;
    let updateData = { ...req.body };
    delete updateData.id;
    delete updateData.employee_id;
    updateData.updated_at = new Date();

    const { data, error } = await supabase
      .from('employee_family_details')
      .update(updateData)
      .eq('id', familyId)
      .select();

    if (error) {
      console.error('Error updating family details:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Family member updated successfully', family: data[0] });
  } catch (err) {
    console.error('Server error in updateEmployeeFamily:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteEmployeeFamily = async (req, res) => {
  try {
    const { familyId } = req.params;

    const { error } = await supabase
      .from('employee_family_details')
      .delete()
      .eq('id', familyId);

    if (error) {
      console.error('Error deleting family details:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Family member deleted successfully' });
  } catch (err) {
    console.error('Server error in deleteEmployeeFamily:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
