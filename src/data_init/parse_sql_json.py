"""
Parses pe_data_remap.psql and admin_data_remap.psql
converts to json to allow for insert statement creation.

"""
import ast

def CreateSqlJson(file_path):
    f = open(file_path,'r')
    is_start = False
    out = []
    for line in f:
        if is_start:
            if '--' in line:
                continue

        if is_start:
            out.append(line)
        if line.strip() == '--startread':
            is_start = True
    f.close()
    out_str = ''.join(out)
    x = ast.literal_eval(out_str)
    return x

if __name__ == "__main__":
    fp = './psql/pe_data_remap.psql'
    x  = CreateSqlJson(fp)
    print(x)